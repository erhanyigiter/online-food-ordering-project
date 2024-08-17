import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from "../components/Loader";
import Error from "../components/Error";
import RestCard from "../components/RestCard";
import { getRestaurants } from "../redux/slices/restaurantSlice"; // Yeni yerden içe aktarım
import Container from "../components/Container";
import { toast } from 'react-toastify';

const Main = () => {
  // Storedaki restaurant reducer'a abone olma
  const { isLoading, error, restaurants = [] } = useSelector((store) => store.restaurant);
  const { isAuthenticated } = useSelector((store) => store.auth); // Kullanıcı giriş durumu kontrolü
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Bileşen ekrana basılınca API isteği at reducer'ı güncelle
  useEffect(() => {
    dispatch(getRestaurants());
  }, [dispatch]);

  const handleCardClick = (restaurantId) => {
    if (!isAuthenticated) {
      toast.error('Lütfen devam etmek için giriş yapın.', {
        position: "top-right",
        autoClose: 5000,
      });
      navigate('/login'); // Giriş sayfasına yönlendir
    } else {
      navigate(`/restaurant/${restaurantId}`); // Restoran detay sayfasına yönlendir
    }
  };
  
  return (
    <Container className="flex-grow">
      <h1 className="text-3xl mb-4">Tüm Restoranlar</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error msg={error} retry={() => dispatch(getRestaurants())} />
      ) : (
        Array.isArray(restaurants) && restaurants.length > 0 ? (
          <div className="grid gap-5 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {restaurants.map((rest) => (
              <RestCard key={rest.id} data={rest} onClick={() => handleCardClick(rest.id)} />
            ))}
          </div>
        ) : (
          <p>Henüz restoran eklenmedi.</p>
        )
      )}
    </Container>
  );
}

export default Main;
