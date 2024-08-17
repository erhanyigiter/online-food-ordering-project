import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import Loader from './../../components/Loader';
import Error from './../../components/Error';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../../Styles/Button.css';
import { getRestaurantById } from '../../redux/slices/restaurantSlice'; // Thunk import
import { getCart } from '../../redux/slices/cartSlice'; // Sepeti çekmek için thunk import

const stripePromise = loadStripe('pk_test_51PkWrJIWauXDMvpOTP6D32FaFEkOQiimoPNoTpbinAAk0e2B9ajKClEQmTvly73MEyKDnuZRhuUdXh97XMTJ4dje00ynkpDLss'); // Stripe Public Key

const Cart = () => {
  const dispatch = useDispatch();
  const { isLoading, error, cart } = useSelector((store) => store.cart);
  const { selectedRestaurant: restaurant } = useSelector((store) => store.restaurant); // Restoran bilgilerini almak için
  const { isAuthenticated } = useSelector((store) => store.auth); // Kullanıcının oturum durumu
  const cartItems = Array.isArray(cart) ? cart : [];
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // İlk yükleme kontrolü için state

  // İlk yükleme sırasında sepeti güncelle
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart()); // Kullanıcı giriş yaptıysa sepeti çek
      setIsInitialLoad(false); // İlk yükleme tamamlandı olarak ayarla
    }
  }, [dispatch, isAuthenticated]);

  // Restoran detaylarını yüklemek için effect
  useEffect(() => {
    if (restaurantId && (!restaurant || restaurant.id !== restaurantId)) {
      dispatch(getRestaurantById(restaurantId)); // Restaurant detaylarını yüklemek için aksiyonu tetikleyin
    }
  }, [restaurant, restaurantId, dispatch]);

  const calculateTotalAmount = () => {
    return cartItems.reduce((acc, item) => {
      const price = parseFloat(item.price) || 0;
      const amount = item.amount || 1; // Miktar varsayılan olarak 1 olarak alınır
      return acc + (price * amount);
    }, 0);
  };

  const totalAmount = calculateTotalAmount();
  const restaurantMinAmount = restaurant?.minPrice || 0; // Restoranın belirlediği minimum tutar

  const handlePaymentClick = () => {
    if (!restaurant) {
      toast.error('Restoran bilgileri alınamadı, lütfen sayfayı yenileyin.', {
        position: "bottom-right", 
        autoClose: 5000,
      });
    } else if (totalAmount < restaurantMinAmount) {
      toast.error(`${restaurant.name}'ın alt limiti ${restaurantMinAmount} TL dir. `, {
        position: "bottom-right",
        autoClose: 5000,
      });
      
    } else {
      // Başarılı ödeme mesajı göstermek için
      toast.success(`Toplam tutar: ${totalAmount.toFixed(2)} TL. ${restaurant.name} Alışverşiniz için teşekürler`, {
        position: "bottom-right",
        autoClose: 5000,
      });
      setShowPaymentPopup(true);
    }
  };

  const handleRestaurantIdChange = (id) => {
    setRestaurantId(id); // Restoran ID'sini state'e kaydediyoruz
  };

  return (
    <>
      {isInitialLoad ? (
        <Loader /> // İlk yükleme sırasında bir loader gösterebiliriz
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-5">SEPET</h1>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Error />
          ) : cartItems.length === 0 ? (
            <p className="flex flex-col items-center gap-3">
              Sepette herhangi bir ürün yok.
              <Link className="border p-2 shadow rounded hover:bg-gray-100" to={'/'}>
                Ürün Ekle
              </Link>
            </p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <CartItem key={`${item.id}-${index}`} item={item} onRestaurantIdChange={handleRestaurantIdChange} />
              ))}
              <p className="text-lg font-bold mt-5">Toplam Tutar: {totalAmount.toFixed(2)} TL</p>

              {/* Ödeme yapma butonu yerine yeni HTML yapısı */}
              <div className="container mt-5 cursor-pointer" onClick={handlePaymentClick}>
                <div className="left-side">
                  <div className="card2">
                    <div className="card2-line"></div>
                    <div className="buttons"></div>
                  </div>
                  <div className="post">
                    <div className="post-line"></div>
                    <div className="screen">
                      <div className="dollar">$</div>
                    </div>
                    <div className="numbers"></div>
                    <div className="numbers-line2"></div>
                  </div>
                </div>
                <div className="right-side">
                  <div className="new">Ödeme Yap</div>
                  <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" className="arrow">
                    <path
                      fill="#cfcfcf"
                      d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"
                    ></path>
                  </svg>
                </div>
              </div>
            </>
          )}

          {showPaymentPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-5 rounded shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">Ödeme Bilgileri</h2>

                <Elements stripe={stripePromise}>
                  <CheckoutForm totalAmount={totalAmount} />
                </Elements>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">Örnek Kart Bilgileri:</p>
                  <ul className="list-disc pl-5">
                    <li>Kart Numarası: 4242 4242 4242 4242</li>
                    <li>AY/YIL: 12/34</li>
                    <li>CVC: 123</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowPaymentPopup(false)}
                  className="bg-red-500 text-white py-2 px-4 rounded mt-5"
                >
                  İptal
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Cart;
