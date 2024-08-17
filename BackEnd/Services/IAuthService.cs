using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Identity;

namespace BackEnd.Services
{
    public interface IAuthService
    {
        Task<string> GenerateTokenString(ApplicationUser identityUser); 
        Task<bool> Login(LoginUser user);
        Task<bool> RegisterUser(LoginUser user);
    }
}
