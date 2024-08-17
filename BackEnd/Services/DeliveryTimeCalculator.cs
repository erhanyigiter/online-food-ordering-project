using System.Threading.Tasks;

namespace BackEnd.Services
{
    public class DeliveryTimeCalculator
    {
        private readonly GeocodingService _geocodingService;
        private readonly LocationService _locationService;
        private const double CityAverageSpeedKmPerHour = 45.0; // Şehir içi ortalama hız
        private const double IntercityAverageSpeedKmPerHour = 80.0; // Şehirler arası ortalama hız
        private const double CityPreparationTimeMinutes = 5.0; // Şehir içi hazırlık süresi
        private const double IntercityPreparationTimeMinutes = 15.0; // Şehirler arası hazırlık süresi

        public DeliveryTimeCalculator(GeocodingService geocodingService, LocationService locationService)
        {
            _geocodingService = geocodingService;
            _locationService = locationService;
        }

        public async Task<double> CalculateEstimatedDeliveryTimeAsync(string userAddress, string restaurantAddress, int restaurantEstimatedDelivery)
        {
            var userCoordinates = await _geocodingService.GetCoordinatesAsync(userAddress);
            var restaurantCoordinates = await _geocodingService.GetCoordinatesAsync(restaurantAddress);

            double distanceKm = _locationService.GetDistance(userCoordinates.lat, userCoordinates.lng, restaurantCoordinates.lat, restaurantCoordinates.lng);

            // Şehir içi mi şehirler arası mı kontrol ediyoruz
            bool isIntercity = distanceKm > 50; // Örneğin, 50 km üstü şehirlerarası olarak kabul edelim
            double averageSpeedKmPerHour = isIntercity ? IntercityAverageSpeedKmPerHour : CityAverageSpeedKmPerHour;
            double preparationTimeMinutes = isIntercity ? IntercityPreparationTimeMinutes : CityPreparationTimeMinutes;

            double estimatedTimeMinutes = (distanceKm / averageSpeedKmPerHour) * 60;
            return estimatedTimeMinutes + preparationTimeMinutes + restaurantEstimatedDelivery;
        }
          // Kullanıcı ve restoran adresleri arasındaki mesafeyi hesaplayan metot
        public async Task<double> CalculateDistanceAsync(string userAddress, string restaurantAddress)
        {
            var userCoordinates = await _geocodingService.GetCoordinatesAsync(userAddress);
            var restaurantCoordinates = await _geocodingService.GetCoordinatesAsync(restaurantAddress);

            double distanceKm = _locationService.GetDistance(userCoordinates.lat, userCoordinates.lng, restaurantCoordinates.lat, restaurantCoordinates.lng);

            return distanceKm;
        }

    }
}
