using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Contextes;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly AuthDemoDbContext _context;

        public RestaurantService(AuthDemoDbContext context)
        {
            _context = context;
        }

        public async Task<List<Restaurant>> GetAllRestaurantsAsync()
        {
            return await _context.Restaurants
                .Include(r => r.Photos)
                .Include(r => r.Category)
                .ToListAsync();
        }

        public async Task<Restaurant> GetRestaurantByIdAsync(int id)
        {
            return await _context.Restaurants
                .Include(r => r.Photos)
                .Include(r => r.Category)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Restaurant> CreateRestaurantAsync(Restaurant restaurant)
        {
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
            return restaurant;
        }

        public async Task<Restaurant> UpdateRestaurantAsync(Restaurant restaurant)
        {
            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();
            return restaurant;
        }

        public async Task DeleteRestaurantAsync(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant != null)
            {
                restaurant.IsDelete = true;
                _context.Restaurants.Update(restaurant);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Photo> AddPhotoAsync(int restaurantId, string fileName)
        {
            var photo = new Photo
            {
                FileName = fileName,
                RestaurantId = restaurantId
            };

            _context.Photos.Add(photo);
            await _context.SaveChangesAsync();

            return photo;
        }
        public async Task<Restaurant> GetRestaurantByAddressAsync(string address)
        {
            return await _context.Restaurants
                                 .FirstOrDefaultAsync(r => r.Address == address);
        }

    }
}
