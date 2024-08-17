import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsFillHouseFill } from "react-icons/bs";
import Loader from '../components/Loader';
import Error from '../components/Error';
import { backendApi } from '../utils/api';

const NearestRestaurants = () => {
  const user = useSelector((store) => store.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchNearestRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user || !user.address) {
        throw new Error('Kullanıcı adresi bulunamadı');
      }

      // Adresin zaten kodlanmış olup olmadığını kontrol ediyoruz ve gerektiğinde kodluyoruz
      const userAddressEncoded = decodeURIComponent(user.address).includes('%') 
        ? user.address 
        : encodeURIComponent(user.address.trim());

      console.log('Encoded User Address:', userAddressEncoded);

      const response = await backendApi.get('/api/Restaurant/nearest-restaurants', {
        params: {
          userAddress: userAddressEncoded,
        },
      });

      if (Array.isArray(response.data)) {
        setRestaurants(response.data);
      } else if (response.data && response.data.$values) {
        setRestaurants(response.data.$values);
      } else {
        throw new Error('Beklenmedik veri formatı alındı');
      }
    } catch (err) {
      console.error("Error fetching nearest restaurants:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.address && showPopup) {
      fetchNearestRestaurants();
    }
  }, [user, showPopup]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error msg={error} />;
  }

  return (
    <div className="flex items-center">
      <button
        className="bg-red-500 text-white py-1 px-3 rounded-full text-xs font-semibold shadow-md hover:bg-red-600 hover:shadow-lg transition duration-200 ease-in-out flex items-center"
        onClick={() => setShowPopup(true)}
      >
        <BsFillHouseFill className="inline-block mr-1 text-sm" /> En Yakın Restoranlar
      </button>

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{ zIndex: 1000 }} // Popup'un üstte olmasını sağlar
        >
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full" style={{ zIndex: 1100 }}>
            <h3 className="text-lg font-semibold mb-4">Size En Yakın Restoranlar</h3>
            <ul className="list-disc pl-5">
              {restaurants.map((restaurant) => (
                <li key={restaurant.id} className="mb-2">
                  <Link
                    to={`/restaurant/${restaurant.id}`}
                    className="text-red-500 hover:underline font-bold"
                  >
                    {restaurant.name}
                  </Link>
                  <p>{restaurant.address}</p>
                  <p>Mesafe: {restaurant.distanceKm.toFixed(2)} km</p>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white py-1 px-2 rounded text-sm"
              onClick={() => setShowPopup(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearestRestaurants;
