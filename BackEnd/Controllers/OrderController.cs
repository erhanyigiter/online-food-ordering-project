using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using BackEnd.Services;
using Microsoft.Net.Http.Headers;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DeliveryTimeCalculator _deliveryTimeCalculator;
        private readonly IRestaurantService _restaurantService;

        public OrderController(DeliveryTimeCalculator deliveryTimeCalculator, IRestaurantService restaurantService)
        {
            _deliveryTimeCalculator = deliveryTimeCalculator;
            _restaurantService = restaurantService;
        }

        [HttpGet("estimated-delivery-time")]
        public async Task<IActionResult> GetEstimatedDeliveryTime(string userAddress, string restaurantAddress)
        {
            try
            {
                // Restoranın tahmini teslimat süresini veritabanından alıyoruz
                int restaurantEstimatedDelivery = await GetRestaurantEstimatedDeliveryAsync(restaurantAddress);

                double estimatedDeliveryTime = await _deliveryTimeCalculator.CalculateEstimatedDeliveryTimeAsync(userAddress, restaurantAddress, restaurantEstimatedDelivery);

                // Süreleri yuvarlayarak alıyoruz
                int roundedEstimatedDelivery = (int)Math.Round((decimal)restaurantEstimatedDelivery);
                int roundedEstimatedDeliveryTime = (int)Math.Round(estimatedDeliveryTime);
                int deliveryTravelTime = roundedEstimatedDeliveryTime - roundedEstimatedDelivery;

                var response = new
                {
                    restaurantEstimatedDeliveryMinutes = $"{roundedEstimatedDelivery} dakika",
                    deliveryTravelTimeMinutes = $"{deliveryTravelTime} dakika",
                    totalEstimatedDeliveryTimeMinutes = $"{roundedEstimatedDeliveryTime} dakika"
                };

                // Conditional Request Caching için ETag hesapla
                string eTag = $"\"{roundedEstimatedDelivery}-{roundedEstimatedDeliveryTime}-{deliveryTravelTime}\"";
                var lastModified = DateTime.UtcNow; // Örnek olarak şu anki zamanı kullanıyoruz

                // ETag veya Last-Modified ile gelen talepleri kontrol et
                if (Request.Headers.ContainsKey(HeaderNames.IfNoneMatch) && Request.Headers[HeaderNames.IfNoneMatch].ToString() == eTag)
                {
                    return StatusCode(304); // Veri değişmemiş, 304 Not Modified yanıtını döndür
                }

                if (Request.Headers.ContainsKey(HeaderNames.IfModifiedSince) && DateTime.Parse(Request.Headers[HeaderNames.IfModifiedSince]) >= lastModified)
                {
                    return StatusCode(304); // Veri değişmemiş, 304 Not Modified yanıtını döndür
                }

                // Yanıt olarak ayrı ayrı süreleri ve toplam süreyi döndürüyoruz
                Response.Headers[HeaderNames.ETag] = eTag;
                Response.Headers[HeaderNames.LastModified] = lastModified.ToString("R");

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Hata durumunda 400 yanıtı döndürüyoruz
                return BadRequest(new { error = ex.Message });
            }
        }

        private async Task<int> GetRestaurantEstimatedDeliveryAsync(string restaurantAddress)
        {
            var restaurant = await _restaurantService.GetRestaurantByAddressAsync(restaurantAddress);
            if (restaurant == null)
            {
                throw new Exception("Restaurant not found");
            }
            return restaurant.EstimatedDelivery;
        }
    }
}
