using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Models;

namespace BackEnd.Services
{
    public interface IRestaurantService
    {
        Task<List<Restaurant>> GetAllRestaurantsAsync();
        Task<Restaurant> GetRestaurantByIdAsync(int id);
        Task<Restaurant> CreateRestaurantAsync(Restaurant restaurant);
        Task<Restaurant> UpdateRestaurantAsync(Restaurant restaurant);
        Task DeleteRestaurantAsync(int id);
        Task<Photo> AddPhotoAsync(int restaurantId, string fileName);
        Task<Restaurant> GetRestaurantByAddressAsync(string address);
    }
}
