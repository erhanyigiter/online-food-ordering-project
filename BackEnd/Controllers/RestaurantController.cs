using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantService _restaurantService;
        private readonly DeliveryTimeCalculator _deliveryTimeCalculator;

        public RestaurantController(IRestaurantService restaurantService, DeliveryTimeCalculator deliveryTimeCalculator)
        {
            _restaurantService = restaurantService;
            _deliveryTimeCalculator = deliveryTimeCalculator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Restaurant>>> GetAllRestaurants()
        {
            var restaurants = await _restaurantService.GetAllRestaurantsAsync();
            return Ok(restaurants);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Restaurant>> GetRestaurantById(int id)
        {
            var restaurant = await _restaurantService.GetRestaurantByIdAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }

            return Ok(restaurant);
        }

        [HttpGet("nearest-restaurants")]
        public async Task<IActionResult> GetNearestRestaurants(string userAddress)
        {
            try
            {
                var restaurants = await _restaurantService.GetAllRestaurantsAsync();
                var restaurantDistances = new List<(Restaurant restaurant, double distance)>();

                foreach (var restaurant in restaurants)
                {
                    double distance = await _deliveryTimeCalculator.CalculateDistanceAsync(userAddress, restaurant.Address);
                    restaurantDistances.Add((restaurant, distance));
                }

                var sortedRestaurants = restaurantDistances.OrderBy(r => r.distance).ToList();

                return Ok(sortedRestaurants.Select(r => new
                {
                    r.restaurant.Id,
                    r.restaurant.Name,
                    r.restaurant.Address,
                    r.restaurant.EstimatedDelivery,
                    DistanceKm = r.distance
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
