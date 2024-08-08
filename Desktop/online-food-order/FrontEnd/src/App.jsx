import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Header from "./components/Header";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Sidebar from "./components/Sidebar"; // Sidebar bileşenini içe aktar
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCart } from "./redux/slices/cartSlice";

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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
