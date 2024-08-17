import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { backendApi } from '../../utils/api';
import { toast } from 'react-toastify';

// Sepeti getirme işlemi
export const getCart = createAsyncThunk('cart/getCart', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  try {
    console.log('Fetching cart for user...');
    const response = await backendApi.get('/api/Cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Cart data fetched:', response.data);
    return response.data.$values || [];  // API'den gelen response'un $values kısmı alınıyor
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});


// Sepete ürün ekleme işlemi
export const addToBasket = createAsyncThunk(
  'cart/addToBasket',
  async ({ productId, amount }, thunkAPI) => {  // userId kaldırıldı
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      toast.error('Sipariş vermek için önce giriş yapmalısınız!');
      return thunkAPI.rejectWithValue('User not logged in');
    }

    try {
      // Ürünün restoran bilgilerini alıyoruz
      const productResponse = await backendApi.get(`/api/Product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productData = productResponse.data;
      const restaurantId = productData.restaurant?.id;
      const restaurantName = productData.restaurant?.name;

      if (!restaurantId) {
        toast.error('Ürünün restoran bilgisi alınamadı.');
        return thunkAPI.rejectWithValue('Restaurant not found for product');
      }

      // Sepette başka bir restorana ait ürün olup olmadığını kontrol ediyoruz
      const differentRestaurantItem = state.cart.cart.find(
        item => item.restaurantId !== restaurantId
      );

      if (differentRestaurantItem) {
        toast.error('Sepete aynı anda sadece tek bir restorandan ürün ekleyebilirsiniz.');
        return thunkAPI.rejectWithValue('Different restaurant item in cart');
      }

      const response = await backendApi.post(
        `/api/Cart?productId=${productId}&amount=${amount}`,  // userId kaldırıldı
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response:', response);
      thunkAPI.dispatch(getCart());  // Sepeti güncelle
      toast.success(`${productData.name} (${restaurantName}) sepete eklendi!`);
      return {
        ...response.data,
        productName: productData.name,
        restaurantName,
      };
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      if (error.response && error.response.status === 401) {
        toast.error('Yetkisiz erişim! Lütfen giriş yapınız.');
      } else {
        toast.error('Ürün sepete eklenirken bir hata oluştu!');
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Sepet ürününü güncelleme işlemi
export const updateItem = createAsyncThunk(
  'cart/updateItem',
  async ({ id, newAmount }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    try {
      // Ürünün adı ve restoran bilgilerini almak için API çağrısı
      const cartItem = state.cart.cart.find(item => item.id === id);
      const productResponse = await backendApi.get(`/api/Product/${cartItem.productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productData = productResponse.data;
      const productName = productData.name;
      const price = productData.price;

      console.log(`Updating cart item ${id}...`);
      const response = await backendApi.put(
        `/api/Cart/update/${id}`,
        { amount: newAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Cart item updated:', response.data);
      thunkAPI.dispatch(getCart());  // Sepeti güncelle

      toast.info(`"${productName}" adlı ürün ${newAmount} olarak güncellendi.`);
      return {
        ...response.data,
        productName,
        price
      };
    } catch (error) {
      console.error('Error updating cart item:', error.message);
      toast.error('Ürün miktarı güncellenirken bir hata oluştu!');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Sepet ürününü silme işlemi
export const deleteItem = createAsyncThunk('cart/deleteItem', async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  try {
    console.log(`Deleting cart item ${id}...`);
    await backendApi.delete(`/api/Cart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`Cart item ${id} deleted`);
    thunkAPI.dispatch(getCart());  // Sepeti güncelle
    toast.info('Ürün sepetten çıkarıldı.');
    return id;
  } catch (error) {
    console.error('Error deleting cart item:', error.message);
    toast.error('Ürünü sepetten çıkarırken bir hata oluştu!');
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice oluşturma
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
        console.log('Fetching cart: pending...');
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.map(item => ({
          ...item,
          productName: item.productName || 'Ürün bilgisi bulunamadı',
          productDescription: item.productDescription || '',
          price: item.price || 0,  // Buradaki price değeri kontrol ediliyor
          restaurantName: item.restaurantName || 'Restoran bilgisi bulunamadı',
        }));
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToBasket.fulfilled, (state, action) => {
        // Sepet güncellemesi zaten getCart tarafından yönetildiği için burada ek bir işlem gerekmez
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.cart.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.cart[index] = {
            ...state.cart[index],
            amount: action.payload.amount,
            productName: action.payload.productName || state.cart[index].productName,
            price: action.payload.price || state.cart[index].price,
          };
        }
      });
  }
});



export default cartSlice.reducer;
