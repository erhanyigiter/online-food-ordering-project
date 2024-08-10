using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;

namespace BackEnd.Services
{
    public interface IAuthService
    {
        string GenerateTokenString(LoginUser user);
        Task <bool>Login(LoginUser user);
        Task<bool> RegisterUser(LoginUser user);

    }
}