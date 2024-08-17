import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { BsBasket3, BsFillHouseFill, BsBoxArrowInRight, BsPersonPlus } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { logout, fetchUserProfile, initializeToken } from '../redux/slices/authSlice';
import Container from "../components/Container";
import NearestRestaurants from "../components/NearestRestaurants";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    dispatch(initializeToken());
  }, [dispatch]);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (user && user.address) {
      setSelectedAddress(user.address);
    }
  }, [user]);

  const handleAddressSelect = (address) => {
    if (address === "new") {
      navigate('/profile');
    } else {
      setSelectedAddress(address);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="shadow py-3">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to={'/'} className="text-2xl sm:text-3xl font-bold font-mono text-red-500">
            YemekSepeti
          </Link>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedAddress}
                onChange={(e) => handleAddressSelect(e.target.value)}
                className="border border-gray-300 rounded-full py-1 px-3 text-sm w-40 sm:w-auto focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="" disabled>
                  Teslimat bölgenizi seçin
                </option>
                <option value={user?.address}>{user?.address}</option>
                <option value="new">+ Yeni Adres Ekle</option>
              </select>
              <button
                onClick={() => handleAddressSelect(selectedAddress)}
                className="bg-red-500 text-white py-1 px-3 rounded-full text-sm font-semibold shadow-md hover:bg-red-600 hover:shadow-lg transition duration-200 ease-in-out flex items-center w-auto sm:w-auto"
              >
                <BsFillHouseFill className="inline mr-1 text-sm" /> Adres
              </button>
              {selectedAddress && (
                <NearestRestaurants userAddress="Kullanıcının adresi" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-0 sm:ml-4">
            {token && user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 font-semibold hover:underline hover:text-red-500 flex items-center cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Merhaba, {user.fullName || user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="Btn"
                >
                  <div className="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </div>
                  <div className="text">Logout</div>
                </button>
                <Link
                  to="/cart"
                  className="hover:bg-red-500 hover:bg-opacity-15 rounded-full p-2"
                >
                  <BsBasket3 className="text-red-500 text-xl" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border border-red-500 py-1 px-2 rounded-full text-red-500 transition hover:bg-red-500 hover:text-white flex items-center text-sm"
                >
                  <BsBoxArrowInRight className="mr-1 text-sm" /> Giriş
                </Link>
                <Link
                  to="/register"
                  className="bg-red-500 py-1 px-2 rounded-full text-white transition hover:bg-red-600 flex items-center text-sm"
                >
                  <BsPersonPlus className="mr-1 text-sm" /> Kayıt
                </Link>
                <Link
                  to="/cart"
                  className="hover:bg-red-500 hover:bg-opacity-15 rounded-full p-2"
                >
                  <BsBasket3 className="text-red-500 text-xl" />
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
