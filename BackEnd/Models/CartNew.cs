using System.Collections.Generic;
using System.Linq;
using BackEnd.Contextes;

namespace BackEnd.Models
{
    public class CartNew
    {
        private readonly AuthDemoDbContext _db;

        public CartNew(AuthDemoDbContext db)
        {
            _db = db;
        }

        public static List<Cart> Carts = new List<Cart>();

        public void AddToCart(int productId, int amount, string userId)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == productId);

            if (product != null)
            {
                var cartItem = Carts.FirstOrDefault(c => c.ProductId == productId && c.UserId == userId );
                if (cartItem != null)
                {
                    cartItem.Amount += amount;
                }
                else
                {
                    Cart newCart = new Cart
                    {
                        ProductId = productId,
                        Amount = amount,
                        UserId = userId,
                        Product = product
                    };
                    Carts.Add(newCart);
                }
            }
        }

        public void UpdateCartItem(int id, int newAmount)
        {
            var cartItem = Carts.FirstOrDefault(c => c.Id == id);
            if (cartItem != null)
            {
                cartItem.Amount = newAmount;
            }
        }

        public void DeleteCartItem(int id)
        {
            var cartItem = Carts.FirstOrDefault(c => c.Id == id);
            if (cartItem != null)
            {
                Carts.Remove(cartItem);
            }
        }

        public Cart IncrementCartItem(int id)
        {
            var cartItem = Carts.FirstOrDefault(c => c.Id == id);
            if (cartItem != null)
            {
                cartItem.Amount += 1;
            }
            return cartItem;
        }

        public Cart DecrementCartItem(int id)
        {
            var cartItem = Carts.FirstOrDefault(c => c.Id == id);
            if (cartItem != null && cartItem.Amount > 1)
            {
                cartItem.Amount -= 1;
            }
            return cartItem;
        }
    }
}
