import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { backendApi } from '../../utils/api';

// Thunk Action
export const getDataByRestId = createAsyncThunk(
  'product/getDataByRestId',
  async (id, thunkAPI) => {
    // İki farklı API isteğini aynı anda yapıyoruz
    const req1 = backendApi.get(`api/Restaurant/${id}`);
    const req2 = backendApi.get(`api/Product/byrestaurant/${id}`);
    
    try {
      // İki API isteğini aynı anda çalıştırıyoruz
      const responses = await Promise.all([req1, req2]);

      // Gelen response'ları $values içerisinden alıyoruz
      const restaurantData = responses[0].data;
      const productsData = responses[1].data.$values || []; // $values ile ürünleri alıyoruz
      

      // Ürün bulunamadıysa kontrol ediyoruz
      const noProductsFound = productsData.length === 0;

      return {
        restaurant: restaurantData,
        products: productsData,
        noProductsFound: noProductsFound,
      };
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
    noProductsFound: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDataByRestId.pending, (state) => {
        state.isLoading = true;
        state.noProductsFound = false; // Her yeni istekte sıfırlıyoruz
      })
      .addCase(getDataByRestId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurant = action.payload.restaurant; // Restoran verisi
        state.products = action.payload.products; // Ürünler verisi
        state.noProductsFound = action.payload.noProductsFound; // Ürün bulunamadı durumu
      })
      .addCase(getDataByRestId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.noProductsFound = false; // Hata durumunda ürün bulunamadı durumu sıfırlanır
      });
  }
});

export default productSlice.reducer;
