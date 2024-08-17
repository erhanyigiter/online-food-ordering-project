import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteItem, updateItem } from '../../redux/slices/cartSlice';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { backendApi } from '../../utils/api';
import { toast } from 'react-toastify';

const CartItem = ({ item, onRestaurantIdChange }) => { // onRestaurantIdChange propunu ekledik
  const dispatch = useDispatch();
  const [restaurantName, setRestaurantName] = useState();
  const [restaurantId, setRestaurantId] = useState(null); // Restoran ID'sini saklayacak state
  const [productName, setProductName] = useState(item.productName || 'Ürün bilgisi alınamadı');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await backendApi.get(`/api/Product/${item.productId}`);
        if (response.data) {
          setProductName(response.data.name);
          if (response.data.restaurant) {
            setRestaurantName(response.data.restaurant.name);
            setRestaurantId(response.data.restaurant.id); // Restoran ID'sini sakla
            onRestaurantIdChange(response.data.restaurant.id); // Restoran ID'sini üst bileşene gönder
          }
        } else {
          toast.error('Ürün ismi alınamadı!');
        }
      } catch (error) {
        console.error('Ürün veya restoran bilgisi alınamadı:', error);
        toast.error('Ürün ismi alınamadı!');
      }
    };

    fetchProductDetails();
  }, [item.productId]);

  const increase = () => {
    dispatch(updateItem({ id: item.id, newAmount: item.amount + 1, productName }));
  };

  const decrease = () => {
    if (item.amount > 1) {
      dispatch(updateItem({ id: item.id, newAmount: item.amount - 1, productName }));
    } else {
      dispatch(deleteItem(item.id));
    }
  };

  return (
    <div className="flex gap-4 border mb-10 rounded-lg p-4 hover:shadow">
      <img className="w-[115px] rounded-lg" src={item.photo} alt={productName} />
      <div className="w-full flex flex-col justify-between">
        <h3 className="text-xl font-semibold text-red-500">{productName}</h3>
        <p className="text-gray-500">{item.productDescription}</p>
        <p className="text-gray-500">Restoran: {restaurantName}</p>
        <div className="flex justify-between items-end">
          <p className="font-semibold">{item.price} ₺</p>
          <div className="border rounded-xl text-lg">
            <button
              onClick={decrease}
              className="p-3 rounded-xl text-red-500 transition hover:bg-red-100"
            >
              {item.amount > 1 ? <FaMinus /> : <BsTrash />}
            </button>
            <span className="p-3">{item.amount}</span>
            <button
              onClick={increase}
              className="p-3 rounded-xl text-red-500 transition hover:bg-red-100"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
