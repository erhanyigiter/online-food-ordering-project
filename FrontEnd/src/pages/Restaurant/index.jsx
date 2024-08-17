import { useEffect } from "react";
import Container from "../../components/Container";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDataByRestId } from "../../redux/slices/productSlice"; 
import ProdDetail from "./ProdDetail";
import RestDetail from "./RestDetail";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

const Restaurant = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Verilerin yüklenip yüklenmediğini veya hata olup olmadığını kontrol etmek için gerekli state'ler
  const { loading, error, products, restaurant } = useSelector((state) => state.product);

  useEffect(() => {
    if (id) {
      dispatch(getDataByRestId(id));
    }
  }, [dispatch, id]);

  return (
    <div>
      <div className="shadow">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error msg={error} />
        ) : restaurant ? (
          <RestDetail restaurant={restaurant} />
        ) : (
          <p>Restoran bilgisi bulunamadı</p>
        )}
      </div>

      <Container>
        {loading ? (
          <Loader />
        ) : error ? (
          <Error msg={error} />
        ) : products && products.length > 0 ? (
          <ProdDetail products={products} />
        ) : (
          <p>Ürün bulunamadı</p>
        )}
      </Container>
    </div>
  );
};

export default Restaurant;
