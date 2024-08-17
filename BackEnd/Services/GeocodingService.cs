using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

namespace BackEnd.Services
{
    public class GeocodingService
    {
        private readonly string _apiKey;
        private readonly HttpClient _httpClient;

        public GeocodingService(string apiKey)
        {
            _apiKey = apiKey;
            _httpClient = new HttpClient();
        }

        public async Task<(double lat, double lng)> GetCoordinatesAsync(string address)
        {
            var url = $"https://api.opencagedata.com/geocode/v1/json?q={Uri.EscapeDataString(address)}&key={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);

            using var jsonDoc = JsonDocument.Parse(response);
            var root = jsonDoc.RootElement;

            // Status kodunu kontrol et
            if (root.TryGetProperty("status", out JsonElement statusElement))
            {
                var statusCode = statusElement.GetProperty("code").GetInt32();
                if (statusCode != 200)
                {
                    throw new Exception("Geocoding service failed. Please check the address and try again.");
                }
            }
            else
            {
                throw new Exception("Geocoding service response is missing status information.");
            }

            // Results dizisini kontrol et
            if (root.TryGetProperty("results", out JsonElement results) && results.GetArrayLength() > 0)
            {
                var firstResult = results[0];

                if (firstResult.TryGetProperty("geometry", out JsonElement geometry))
                {
                    if (geometry.TryGetProperty("lat", out JsonElement latElement) && geometry.TryGetProperty("lng", out JsonElement lngElement))
                    {
                        return (latElement.GetDouble(), lngElement.GetDouble());
                    }
                    else
                    {
                        throw new Exception("Geocoding service failed. Latitude or Longitude information is missing.");
                    }
                }
                else
                {
                    throw new Exception("Geocoding service failed. Geometry information is missing.");
                }
            }
            else
            {
                throw new Exception("Geocoding service failed. Required location data not found.");
            }
        }
    }
}
