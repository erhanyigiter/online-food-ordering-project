using BackEnd.Dto;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly CartNew _cartNew;
        private readonly CartService _cartService;

        public CartController(CartNew cartNew, CartService cartService)
        {
            _cartNew = cartNew;
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Cart>>> GetCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Kullanıcı kimliği doğrulanamadı.");
            }

            var cart = await _cartService.GetCartByUserId(userId);
            return Ok(cart);
        }

        [HttpPost]
        public async Task<ActionResult> AddToCart(int productId, int amount)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Kullanıcı kimliği doğrulanamadı.");
            }

            await _cartService.AddToCart(userId, productId, amount);
            return Ok();
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateCartItem(int id, [FromBody] UpdateCartRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Kullanıcı kimliği doğrulanamadı.");
            }

            await _cartService.UpdateCartItem(userId, id, request.Amount);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCartItem(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Kullanıcı kimliği doğrulanamadı.");
            }

            await _cartService.DeleteCartItem(userId, id);
            return NoContent();
        }

        public class UpdateCartRequest
        {
            public int Amount { get; set; }
        }
    }
}
