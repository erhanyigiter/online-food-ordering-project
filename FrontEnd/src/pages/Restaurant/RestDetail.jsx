import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import RestaurantDeliveryTime from "../../components/RestaurantDeliveryTime";
import { FaArrowDown, FaRegClock, FaStar, FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import { fetchUserProfile } from "../../redux/slices/authSlice";
import { backendApi } from "../../utils/api";


const RestDetail = () => {
  const dispatch = useDispatch();
  const { isLoading, error, restaurant } = useSelector((store) => store.product);
  const { user, loading: userLoading, error: userError } = useSelector((store) => store.auth);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [eTag, setETag] = useState(null);

  useEffect(() => {
    if (!user && !userLoading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, userLoading]);

  useEffect(() => {
    if (user && restaurant) {
      const fetchEstimatedDeliveryTime = async () => {
        try {
          const userAddressEncoded = decodeURIComponent(user.address).includes('%') ? user.address : encodeURIComponent(user.address.trim());
          const restaurantAddressEncoded = decodeURIComponent(restaurant.address).includes('%') ? restaurant.address : encodeURIComponent(restaurant.address.trim());

          const response = await backendApi.get(
            `/api/Order/estimated-delivery-time`,
            {
              params: {
                userAddress: userAddressEncoded,
                restaurantAddress: restaurantAddressEncoded,
              },
              headers: eTag ? { 'If-None-Match': eTag } : {}, // ETag varsa başlığa ekle
            }
          );

          if (response.status === 200) {
            setDeliveryTime(response.data);
            setETag(response.headers['etag']); // Yeni ETag'i kaydet
          }
        } catch (error) {
          if (error.response && error.response.status !== 304) {
            console.error("Error fetching delivery time:", error.response ? error.response.data : error.message);
          }
        }
      };

      fetchEstimatedDeliveryTime();
    }
  }, [user, restaurant, eTag]);

  const restaurantStatus = restaurant?.isStatus ? 'Açık' : 'Kapalı';
  const statusColor = restaurant?.isStatus ? 'text-green-500' : 'text-red-500';

  return (
    <div>
      {isLoading || userLoading ? (
        <Loader />
      ) : error || userError ? (
        <Error msg={error || userError} />
      ) : (
        restaurant && (
          <div className="flex flex-col md:flex-row gap-5">
            <img className="w-[150px] md:w-[200px] rounded" src={restaurant.photo} alt={restaurant.name} />

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">{restaurant.name}</h1>
                <p className="flex items-center gap-2 text-sm md:text-base mt-2">
                  <FaArrowDown className="text-red-500" /> min {restaurant.minPrice} TL
                  <FaRegClock className="text-red-500 ml-4" /> {deliveryTime?.totalEstimatedDelivery || restaurant.estimatedDelivery} dak.
                </p>
                <p className="flex items-center gap-2 text-sm md:text-base mt-2">
                  <FaStar className="text-red-500" /> {restaurant.rating}
                  <button className="text-red-500 font-semibold p-1 rounded hover:bg-red-100 transition ml-2">
                    Yorumları Gör
                  </button>
                </p>
                <p className="flex items-center gap-2 text-sm md:text-base mt-2">
                  <FaMapMarkerAlt className="text-red-500" /> {restaurant?.address || 'Adres bilgisi yok'}
                </p>
                <p className={`flex items-center gap-2 text-sm md:text-base mt-2 ${statusColor}`}>
                  <FaCircle className={`${restaurant?.isStatus ? 'text-green-500' : 'text-red-500'}`} />
                  {restaurantStatus}
                </p>
              </div>

              <RestaurantDeliveryTime
                userAddress={user?.address || "Adres bilgisi yok"}
                restaurantAddress={restaurant.address}
                deliveryTime={deliveryTime}
                className="mt-4 md:mt-0"
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RestDetail;
