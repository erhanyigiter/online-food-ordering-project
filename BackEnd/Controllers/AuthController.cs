using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(IAuthService authService, UserManager<ApplicationUser> userManager)
        {
            _authService = authService;
            _userManager = userManager;
        }

         [HttpPost("register")]
public async Task<IActionResult> RegisterUser([FromBody] LoginUser user)
{
    if (!ModelState.IsValid)
    {
        // Eğer FullName alanı boşsa, otomatik olarak "Yeni Kullanıcı" olarak ayarla ve yeniden validasyon kontrolü yap
        if (string.IsNullOrWhiteSpace(user.FullName))
        {
            user.FullName = "Yeni Kullanıcı";
            ModelState.Clear(); // Mevcut ModelState'i temizleyelim
            TryValidateModel(user); // Modeli tekrar validasyon için kontrol edelim
        }
        
        if (!ModelState.IsValid) // Tekrar validasyon kontrolü yapalım
        {
            return BadRequest(ModelState);
        }
    }

    // Kullanıcı adı veya e-posta zaten mevcut mu kontrol edelim
    var existingUser = await _userManager.FindByNameAsync(user.UserName) ?? await _userManager.FindByEmailAsync(user.UserName);
    if (existingUser != null)
    {
        return BadRequest("Şaka mı yapıyorsun? Zaten müşterimizsin :)");
    }

    // Yeni kullanıcı oluşturuluyor
    var applicationUser = new ApplicationUser
    {
        UserName = user.UserName,
        Email = user.UserName,
        FullName = user.FullName
    };

    var result = await _userManager.CreateAsync(applicationUser, user.Password);
    if (result.Succeeded)
    {
        // E-posta doğrulama tokenı oluştur
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(applicationUser);
        var confirmationLink = Url.Action(nameof(ConfirmEmail), "Auth",
            new { token, email = applicationUser.Email }, Request.Scheme);

        return Ok(new
        {
            Token = token,
            ConfirmationLink = confirmationLink,
            Message = "Kullanıcı başarıyla kaydoldu. Lütfen e-postanızı doğrulayın." 
        });
    }

    return BadRequest(new { Message = "User registration failed.", Errors = result.Errors });
}



        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("Geçersiz e-posta adresi.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                var jwtToken = await _authService.GenerateTokenString(user);
                var redirectUrl = $"http://localhost:5173/login-success?token={jwtToken}";
                return Redirect(redirectUrl);
            }

            return BadRequest("E-posta doğrulama başarısız oldu.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUser user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Geçersiz veri.");
            }

            try
            {
                var identityUser = await _userManager.FindByNameAsync(user.UserName);
                if (identityUser == null)
                {
                    return Unauthorized("Geçersiz kullanıcı adı veya şifre.");
                }

                var passwordCheck = await _authService.Login(user);
                if (!passwordCheck)
                {
                    return Unauthorized("Geçersiz kullanıcı adı veya şifre.");
                }

                if (!identityUser.EmailConfirmed)
                {
                    return Unauthorized(new { Message = "E-posta adresinizi doğrulamadan giriş yapamazsınız.", EmailNotConfirmed = true });
                }

                var tokenString = await _authService.GenerateTokenString(identityUser);
                return Ok(new
                {
                    Token = tokenString,
                    User = new
                    {
                        Username = identityUser.UserName, 
                        FullName = identityUser.FullName,
                        Address = identityUser.Address
                    },
                    Message = "Sitemize hoş geldiniz!"
                });
            }
            catch (InvalidOperationException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ApplicationUser updatedUser)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            user.FullName = updatedUser.FullName;
            user.Address = updatedUser.Address;
            user.PhoneNumber = updatedUser.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Profil başarıyla güncellendi." });
            }

            // Hata durumunda detaylı bilgi döndürelim
            return BadRequest(new { Message = "Profil güncellenirken bir hata oluştu.", Errors = result.Errors });
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            var profile = new
            {
                FullName = user.FullName,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                IsDeleted = user.IsDeleted,
                IsStatus = user.IsStatus
            };

            return Ok(profile);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(string currentPassword, string newPassword)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Şifre başarıyla değiştirildi." });
            }

            // Hata durumunda detaylı bilgi döndürelim
            return BadRequest(new { Message = "Şifre değiştirilemedi.", Errors = result.Errors });
        }
    }
}
