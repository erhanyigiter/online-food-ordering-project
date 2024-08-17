using BackEnd.Contextes;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Services
{
    public class ProductService
    {
        private readonly AuthDemoDbContext _context;

        public ProductService(AuthDemoDbContext context)
        {
            _context = context;
        }

        // Ürünleri kategori ve restoran ile birlikte yükle
        public async Task<List<Product>> GetAllProducts()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Restaurant) // Restoranı da yükle
                .Include(p => p.Photo) // Fotoğrafı da yükle
                .ToListAsync();
        }


        // // Belirli bir ürünü ID ile getirme
        // public async Task<Product> GetProductById(int id)
        // {
        //     return await _context.Products.Include(p => p.Category).Include(p => p.Restaurant)
        //                                   .FirstOrDefaultAsync(p => p.Id == id);
        // }
        public async Task<Product> GetProductById(int id)
{
    return await _context.Products
        .Include(p => p.Restaurant)  // Restoran bilgilerini dahil ediyoruz
        .FirstOrDefaultAsync(p => p.Id == id);
}

        // Yeni ürün ekleme
        public async Task<Product> CreateProduct(Product product)
        {
            // Kategori kontrolü
            var category = await _context.Categories.FindAsync(product.CategoryId);
            if (category == null)
            {
                throw new KeyNotFoundException("Kategori bulunamadı");
            }

            // Restoran opsiyonel
            if (product.RestaurantId.HasValue)
            {
                var restaurant = await _context.Restaurants.FindAsync(product.RestaurantId.Value);
                if (restaurant == null)
                {
                    throw new KeyNotFoundException("Restoran bulunamadı");
                }
            }

            // Fotoğraf kontrolü
            if (product.PhotoId.HasValue)
            {
                var photo = await _context.Photos.FindAsync(product.PhotoId.Value);
                if (photo == null)
                {
                    throw new KeyNotFoundException("Fotoğraf bulunamadı");
                }
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }


        public async Task<List<Product>> GetProductsByRestaurantId(int restaurantId)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Restaurant)
                .Where(p => p.RestaurantId == restaurantId)
                .ToListAsync();
        }


        // Ürün güncelleme
        public async Task<Product> UpdateProduct(Product product)
        {
            // Kategori ve restoran var mı diye kontrol edin
            var category = await _context.Categories.FindAsync(product.CategoryId);
            if (category == null)
            {
                throw new KeyNotFoundException("Kategori bulunamadı");
            }

            var restaurant = await _context.Restaurants.FindAsync(product.RestaurantId);
            if (restaurant == null)
            {
                throw new KeyNotFoundException("Restoran bulunamadı");
            }

            // Fotoğraf kontrolü
            if (product.PhotoId.HasValue)
            {
                var photo = await _context.Photos.FindAsync(product.PhotoId.Value);
                if (photo == null)
                {
                    throw new KeyNotFoundException("Fotoğraf bulunamadı");
                }
            }

            product.Category = category;
            product.Restaurant = restaurant;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return product;
        }

        // Ürün silme
        public async Task DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
         
        }
    }
}
