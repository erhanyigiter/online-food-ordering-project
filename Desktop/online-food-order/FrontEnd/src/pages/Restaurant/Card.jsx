import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket, updateItem } from '../../redux/slices/cartSlice'; // Yeni yerden içe aktarım

const Card = ({ product, restName }) => {
  const { cart } = useSelector((store) => store.cart);
  const dispatch = useDispatch();

  // Mevcut ürünü sepette arama
  const found = cart.find((i) => i.productId === product.id);

  // Sepete ürün ekleme
  const handleAdd = () => {
    // Ürün sepette varsa miktarını arttırma
    if (found) {
      dispatch(updateItem({ id: found.id, newAmount: found.amount + 1 }));
    } else {
      // Sepette yoksa sepete ekleme
      dispatch(addToBasket({ product, restName }));
    }
  };

  return (
    <div className="card border shadow p-3 rounded-lg hover:bg-red-100 hover:scale-[1.02] cursor-pointer transition duration-300">
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-semibold">{product.title}</h1>
          <p className="text-gray-500">{product.desc}</p>
        </div>
        <p className="text-lg font-semibold">{product.price} ₺</p>
      </div>

      <div className="w-[115px] h-[115px] relative">
        <img src={product.photo} className="w-full h-full rounded-md" />

        <button
          onClick={handleAdd}
          className="absolute end-2 bottom-2 bg-white rounded-full hover:bg-red-100 transition w-8 h-8 grid place-items-center"
        >
          {found ? (
            <span className="font-bold">{found.amount}</span>
          ) : (
            <FaPlus className="text-lg" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Card;
