import { useState, useEffect } from "react";
import { backendApi } from '../utils/api';
import { FaRoad, FaMotorcycle, FaUtensils} from "react-icons/fa";

const RestaurantDeliveryTime = ({ userAddress, restaurantAddress }) => {
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [error, setError] = useState(null);

  const fetchDeliveryTime = async () => {
    try {
      const response = await backendApi.get("/api/Order/estimated-delivery-time", {
        params: {
          userAddress,
          restaurantAddress
        }
      });
      console.log('API Response:', response.data); // Konsol logu ekleyin
      setDeliveryTime(response.data);
    } catch (error) {
      console.error('API Error:', error); // Hata konsol logu
      setError(error.message);
    }
  };

  useEffect(() => {
    if (userAddress && restaurantAddress) {
      fetchDeliveryTime();
    }
  }, [userAddress, restaurantAddress]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!deliveryTime) return <p>Loading...</p>;

  return (
    <div className="mt-4 space-y-2 text-sm md:text-base">
      <h2 className="font-semibold text-lg mb-2">Tahmini Teslimat Süresi</h2>
      <p className="flex items-center gap-2">
      <FaUtensils className="text-red-500" />
        <span className="font-semibold">Yemeklerin Ortalama Hazırlığı:</span>
        <span>{deliveryTime.restaurantEstimatedDeliveryMinutes}</span>
      </p>
      <p className="flex items-center gap-2">
        <FaRoad className="text-red-500" />
        <span className="font-semibold">Size Olan Uzaklığımız:</span>
        <span>{deliveryTime.deliveryTravelTimeMinutes}</span>
      </p>
      <p className="flex items-center gap-2">
      <FaMotorcycle className="text-red-500" />
      <span className="font-semibold">Toplam Teslimat Süresi:</span>
        <span>{deliveryTime.totalEstimatedDeliveryTimeMinutes}</span>
      </p>
    </div>
  );
};

export default RestaurantDeliveryTime;
