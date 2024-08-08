import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Thunk Actions
export const getRestaurants = createAsyncThunk(
  'restaurant/getRestaurants',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/restaurants');
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
    restaurants: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRestaurants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurants = action.payload;
      })
      .addCase(getRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { actions, reducer } = restaurantSlice;
export default reducer;
