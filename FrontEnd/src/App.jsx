import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Header from "./components/Header";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Sidebar from "./components/Sidebar"; 
import LoginPage from "./pages/Login/LoginPage";  
import RegisterPage from "./pages/Login/RegisterPage";  
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCart } from "./redux/slices/cartSlice";
import LoginSuccessPage from "./pages/Login/LoginSuccessPage";
import UserProfile from "./pages/UsersProfile/UserProfile";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart()); 
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginPage />} />  
            <Route path="/register" element={<RegisterPage />} />  
            <Route path="/login-success" element={<LoginSuccessPage />} />  
            <Route path="/profile" element={<UserProfile />} />
            {/* Diğer rotalar buraya eklenebilir */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
