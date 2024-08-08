import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
// Thunk Action
export const getDataByRestId = createAsyncThunk(
    'product/getDataByRestId',
    async (id, thunkAPI) => {
      // api istekleri
      const req1 = api.get(`/restaurants/${id}`);
      const req2 = api.get(`/products?restaurantId=${id}`);
  
      try {
        // iki farklı api isteğini aynı anda atarsak veriyi daha hızlı yanıtlayabiliriz
        const responses = await Promise.all([req1, req2]);
        return responses;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  const productSlice = createSlice({
    name: 'product',
    initialState: {
      isLoading: false,
      error: null,
      restaurant: null,
      products: [],
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getDataByRestId.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getDataByRestId.fulfilled, (state, action) => {
          state.isLoading = false;
          state.restaurant = action.payload[0].data;
          state.products = action.payload[1].data;
        })
        .addCase(getDataByRestId.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default productSlice.reducer;
  