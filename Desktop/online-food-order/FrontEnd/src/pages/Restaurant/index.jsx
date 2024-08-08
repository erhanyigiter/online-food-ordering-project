import { useEffect } from "react";
import Container from "../../components/Container";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDataByRestId } from "../../redux/slices/productSlice"; // Yeni yerden içe aktarım
import ProdDetail from "./ProdDetail";
import RestDetail from "./RestDetail";

const Restaurant = () => {
  // URL'deki restoranın idsini gösteren parametreye erişme
  const { id } = useParams();

  // useDispatch kurulum
  const dispatch = useDispatch();

  // Bileşen ekrana basıldığında id'den yola çıkarak
  // restoran ve ürün bilgilerini API'den al reducera aktar
  useEffect(() => {
    if (id) {
      dispatch(getDataByRestId(id));
    }
  }, [dispatch, id]);

  return (
    <div>
      <div className="shadow">
          <RestDetail />
      </div>

      <Container>
        <ProdDetail />
      </Container>
    </div>
  );
};

export default Restaurant;
