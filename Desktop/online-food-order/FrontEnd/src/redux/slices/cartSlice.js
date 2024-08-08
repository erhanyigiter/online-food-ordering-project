import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// Thunk Actions
export const getCart = createAsyncThunk('cart/getCart', async (_, thunkAPI) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const addToBasket = createAsyncThunk(
  'cart/addToBasket',
  async ({ product, restName }, thunkAPI) => {
    const newItem = {
      id: uuidv4(),
      productId: product.id,
      title: product.title,
      price: product.price,
      photo: product.photo,
      restaurantName: restName,
      amount: 1,
    };

    try {
      await api.post('/cart', newItem);
      toast.success(`${newItem.title} sepete eklendi`);
      return newItem;
    } catch (error) {
      toast.error('Üzgünüz, bir sorun oluştu.');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateItem = createAsyncThunk(
  'cart/updateItem',
  async ({ id, newAmount }, thunkAPI) => {
    try {
      const response = await api.patch(`/cart/${id}`, { amount: newAmount });
      toast.info(`Sepetiniz güncellendi. (${newAmount})`);
      return response.data;
    } catch (error) {
      toast.error('Üzgünüz bir sorun oluştu.');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteItem = createAsyncThunk('cart/deleteItem', async (id, thunkAPI) => {
  try {
    await api.delete(`/cart/${id}`);
    toast.warning('Ürün sepetten kaldırıldı');
    return id;
  } catch (error) {
    toast.error('Üzgünüz bir sorun oluştu');
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    isLoading: false,
    error: null,
    cart: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToBasket.fulfilled, (state, action) => {
        state.cart.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.cart.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.cart[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.cart = state.cart.filter(item => item.id !== action.payload);
      });
  }
});

export default cartSlice.reducer;
