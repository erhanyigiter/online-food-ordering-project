using BackEnd.Dto;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using BackEnd.Contextes;

namespace BackEnd.Services
{
    public class CartService
    {
        private readonly AuthDemoDbContext _context;

        public CartService(AuthDemoDbContext context)
        {
            _context = context;
        }

        // Kullanıcının sepetini alma
        public async Task<List<CartDto>> GetCartByUserId(string userId)
        {
            var cartItems = await _context.Carts
                .Include(c => c.Product)
                .ThenInclude(p => p.Restaurant)
                .Where(c => c.UserId == userId)
                .Select(c => new CartDto
                {
                    Id = c.Id,
                    ProductId = c.ProductId,
                    ProductName = c.Product.Name,
                    ProductDescription = c.Product.Description,
                    Amount = c.Amount,
                    RestaurantName = c.Product.Restaurant != null ? c.Product.Restaurant.Name : "Bilinmeyen Restoran",
                    Price = c.Product.Price
                })
                .ToListAsync();

            return cartItems;
        }

        // Sepete ürün ekleme
        public async Task<Cart> AddToCart(string userId, int productId, int amount)
        {
            // Burada userId zaten parametre olarak geliyor, tekrar JWT'den almaya gerek yok
            var sepet = _context.Carts.FirstOrDefault(c => c.UserId == userId);

            if (sepet != null)
            {
                var cartItem1 = _context.Carts.FirstOrDefault(c => c.ProductId == productId && c.UserId == userId);
                if (cartItem1 != null)
                {
                    cartItem1.Amount += amount;
                    _context.Carts.Update(cartItem1);
                    await _context.SaveChangesAsync();
                    return cartItem1;
                }
            }

            var cartItem = new Cart
            {
                UserId = userId,
                ProductId = productId,
                Amount = amount
            };

            _context.Carts.Add(cartItem);
            await _context.SaveChangesAsync();
            return cartItem;
        }

        // Sepet öğesini güncelleme
        public async Task<Cart> UpdateCartItem(string userId, int cartId, int newAmount)
        {
            var cartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Id == cartId);

            if (cartItem == null)
            {
                throw new KeyNotFoundException("Sepet öğesi bulunamadı.");
            }

            cartItem.Amount = newAmount;
            _context.Carts.Update(cartItem);
            await _context.SaveChangesAsync();

            return cartItem;
        }

        // Sepet öğesini silme
        public async Task DeleteCartItem(string userId, int cartId)
        {
            var cartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Id == cartId);

            if (cartItem == null)
            {
                throw new KeyNotFoundException("Sepet öğesi bulunamadı.");
            }

            _context.Carts.Remove(cartItem);
            await _context.SaveChangesAsync();
        }
    }
}
