import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { backendApi } from '../../utils/api';

// Thunk Actions
export const getRestaurants = createAsyncThunk(
  'restaurant/getRestaurants',
  async (_, thunkAPI) => {
    try {
      const response = await backendApi.get('/api/Restaurant');
      console.log('API Response:', response.data); // API yanıtını kontrol et

      const filteredRestaurants = (response.data.$values || []).filter(
        (restaurant) => !restaurant.isDelete && restaurant.isStatus
      );

      return filteredRestaurants;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getRestaurantById = createAsyncThunk(
  'restaurant/getRestaurantById',
  async (id, thunkAPI) => {
    try {
      const response = await backendApi.get(`/api/Restaurant/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    isLoading: false,
    error: null,
    restaurants: [],  // Başlangıç durumu olarak boş dizi
    selectedRestaurant: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRestaurants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurants = action.payload || []; // Yanıt boş olabilir, bu yüzden boş bir diziye fallback
      })
      .addCase(getRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getRestaurantById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRestaurant = action.payload;
      })
      .addCase(getRestaurantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { actions, reducer } = restaurantSlice;
export default reducer;
