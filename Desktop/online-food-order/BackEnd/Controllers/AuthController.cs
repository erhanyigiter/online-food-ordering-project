using System.Threading.Tasks;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(LoginUser user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data");
            }

            if (await _authService.RegisterUser(user))
            {
                return Ok("User registered successfully. Today is a good day to eat some food :)");
            }

            return BadRequest("Are you kidding me? You're already our customer :)");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUser user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data");
            }
            if (await _authService.Login(user))
            {
                var tokenString = _authService.GenerateTokenString(user);
                // return Ok(new { Token = tokenString, Message = "Welcome to our website. The smell of food is already starting to come out of the screen :P" });
                return Ok (tokenString);
            }

            return Unauthorized("Invalid login. Please try again or maybe you're not our customer yet :)");
        }
    }
}
