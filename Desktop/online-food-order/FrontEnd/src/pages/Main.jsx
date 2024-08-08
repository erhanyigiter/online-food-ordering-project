import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import Loader from "../components/Loader";
import Error from "../components/Error";
import RestCard from "../components/RestCard";
import { getRestaurants } from "../redux/slices/restaurantSlice"; // Yeni yerden içe aktarım
import Container from "../components/Container";
import Sidebar from "../components/Sidebar";

const Main = () => {
  // Storedaki restaurant reducer'a abone olma
  const { isLoading, error, restaurants } = useSelector((store) => store.restaurant);

  const dispatch = useDispatch();

  // Bileşen ekrana basılınca API isteği at reducer'ı güncelle
  useEffect(() => {
    dispatch(getRestaurants());
  }, [dispatch]);
  
  return (
    <Container className="flex-grow">
      <h1 className="text-3xl mb-4">Tüm Restoranlar</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error msg={error} retry={() => dispatch(getRestaurants())} />
      ) : (
        <div className="grid gap-5 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.map((rest) => (
            <RestCard key={rest.id} data={rest} />
          ))}
          <Sidebar />
        </div>
        
      )}
    </Container>
  );
}

export default Main;
