using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration; // IConfiguration için gerekli

namespace BackEnd.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _config;

        public AuthService(UserManager<IdentityUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        public async Task<bool> RegisterUser(LoginUser user)
        {
            var identityUser = new IdentityUser
            {
                UserName = user.UserName,
                Email = user.UserName
            };
            var result = await _userManager.CreateAsync(identityUser, user.Password);
            return result.Succeeded;
        }

        public async Task<bool> Login(LoginUser user)
        {
            var identityUser = await _userManager.FindByNameAsync(user.UserName);
            if (identityUser == null)
            {
                return false;
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(identityUser, user.Password);
            if (!passwordCheck)
            {
                // Invalid password
                return false;
            }

            return true; // Successful login
        }

        public string GenerateTokenString(LoginUser user)
        {
            IEnumerable<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.UserName),
                new Claim(ClaimTypes.Role, "Admin"),
            };

            SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetValue<string>("Jwt:Key")));
            
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var securityToken = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                issuer: _config.GetValue<string>("Jwt:Issuer"),
                audience: _config.GetValue<string>("Jwt:Audience"),
                signingCredentials: signingCredentials);
            
            string tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return tokenString;
        }
    }
}
