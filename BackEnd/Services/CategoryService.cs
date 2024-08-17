using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Contextes;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Services
{
    public class CategoryService
    {
        private readonly AuthDemoDbContext _context;

        public CategoryService(AuthDemoDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllCategories()
        {
            return await _context.Categories.Include(c => c.Restaurants).ToListAsync();
        }

        public async Task<Category> GetCategoryById(int id)
        {
            return await _context.Categories.Include(c => c.Restaurants)
                                            .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Category> CreateCategory(string categoryName, List<int> restaurantIds)
        {
            var category = new Category
            {
                Name = categoryName,
                Restaurants = new List<Restaurant>()
            };

            foreach (var restaurantId in restaurantIds)
            {
                var restaurant = await _context.Restaurants.FindAsync(restaurantId);
                if (restaurant == null)
                {
                    throw new KeyNotFoundException($"Restaurant ID {restaurantId} bulunamadı.");
                }
                category.Restaurants.Add(restaurant);
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category> UpdateCategory(int categoryId, string categoryName, List<int> restaurantIds)
        {
            var category = await _context.Categories.Include(c => c.Restaurants)
                                                    .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null)
            {
                throw new KeyNotFoundException("Kategori bulunamadı.");
            }

            category.Name = categoryName;

            // Eski restoran bağlantılarını temizleyin
            category.Restaurants.Clear();

            // Yeni restoran bağlantılarını ekleyin
            foreach (var restaurantId in restaurantIds)
            {
                var restaurant = await _context.Restaurants.FindAsync(restaurantId);
                if (restaurant == null)
                {
                    throw new KeyNotFoundException($"Restaurant ID {restaurantId} bulunamadı.");
                }
                category.Restaurants.Add(restaurant);
            }

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }
    }
}
