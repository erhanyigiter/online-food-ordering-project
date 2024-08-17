import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import restaurantReducer from './slices/restaurantSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import paymentReducer from './slices/paymentSlice';


const store = configureStore({
    reducer: {
      product: productReducer,
      restaurant: restaurantReducer,
      cart: cartReducer,
      auth: authReducer,
      payment: paymentReducer,
    },
  });
  
  export default store;
  
