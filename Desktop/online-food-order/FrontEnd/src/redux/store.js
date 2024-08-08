import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import restaurantReducer from './slices/restaurantSlice';
import cartReducer from './slices/cartSlice';


const store = configureStore({
    reducer: {
      product: productReducer,
      restaurant: restaurantReducer,
      cart: cartReducer,
    },
  });
  
  export default store;
  
