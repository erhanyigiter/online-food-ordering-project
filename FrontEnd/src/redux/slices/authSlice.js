import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { backendApi } from '../../utils/api';
import { getCart } from './cartSlice';

// Kayıt işlemi için asenkron thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await backendApi.post('/api/Auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'auth/updateAddress',
  async ({ newAddress, currentFullName, currentPhoneNumber }, { rejectWithValue }) => {
    try {
      const response = await backendApi.put('/api/Auth/update-profile', 
      { 
        address: newAddress,
        fullName: currentFullName,
        phoneNumber: currentPhoneNumber
      }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Adres güncelleme başarısız');
    }
  }
);

// Giriş işlemi için asenkron thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await backendApi.post('/api/Auth/login', userData);
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Kullanıcı giriş yaptıktan sonra sepet bilgilerini alıyoruz
      await dispatch(getCart());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// E-posta doğrulama linkini yeniden gönderme işlemi için asenkron thunk
export const resendConfirmationEmail = createAsyncThunk(
  'auth/resendConfirmationEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await backendApi.post('/api/Auth/resend-confirmation-email', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await backendApi.get('/api/Auth/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Kullanıcı profilini güncelle
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await backendApi.put('/api/Auth/update-profile', updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Şifre değiştirme işlemi için asenkron thunk
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await backendApi.post('/api/Auth/change-password', passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'), // Token'ı başlangıçta localStorage'dan çekiyoruz
    isAuthenticated: !!localStorage.getItem('token'), // Token varsa giriş yapıldığını varsayıyoruz
    loading: false,
    error: null,
    success: false,
    confirmationLink: null, // Kayıt sonrası confirmation linki için state
    emailNotConfirmed: false, // E-posta doğrulama durumu
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      state.isAuthenticated = false;
      localStorage.removeItem('token'); // Çıkış yapıldığında token'ı localStorage'dan sil
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.success = true;
      state.error = null;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload); // Token'ı localStorage'a kaydet
    },
    initializeToken: (state) => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        state.token = storedToken;
        state.isAuthenticated = true;
      }
    },
    clearErrors: (state) => {
      state.error = null; // Hataları temizlemek için kullanılır
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.confirmationLink = null; // Yeni kayıt sırasında confirmation linki sıfırlanır
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.confirmationLink = action.payload.confirmationLink; // Backend'den gelen confirmation link kaydedilir
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kayıt işlemi başarısız';
        state.success = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.emailNotConfirmed) {
          state.emailNotConfirmed = true;
          state.error = 'E-posta adresinizi doğrulamadan giriş yapamazsınız.';
          state.confirmationLink = action.payload.confirmationLink; // Doğrulama linki kaydediliyor
        } else {
          const token = action.payload.token || action.payload.accessToken || null;
          state.token = token; // Yeni token'ı state'de saklayın
          state.user = action.payload.user || { username: "User" };
          state.success = true;
          state.emailNotConfirmed = false;
          state.isAuthenticated = true;

          // Yeni token'ı kaydedin
          localStorage.setItem('token', token);

          // Giriş sonrası sepeti güncelleme
          setTimeout(() => {
            window.location.reload(); // Giriş yapıldıktan sonra sayfayı yeniden yükleyin
          }, 500); // Yarım saniye sonra sayfa yenilenir
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Giriş işlemi başarısız';
        state.success = false;
        state.isAuthenticated = false;
      })
      .addCase(resendConfirmationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendConfirmationEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = 'Doğrulama e-postası gönderildi.';
      })
      .addCase(resendConfirmationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Doğrulama e-postası gönderimi başarısız';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        console.log("Kullanıcı profili yükleniyor...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        console.error("Kullanıcı profili alınamadı, hata:", action.payload);

        state.loading = false;
        state.error = action.payload || 'Kullanıcı profili alınamadı';
        state.success = false;
        state.isAuthenticated = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kullanıcı profili güncellenemedi';
        state.success = false;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Şifre değiştirme işlemi başarısız';
        state.success = false;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        // Adres güncellenirken diğer alanları koru
        state.user = { 
          ...state.user, 
          address: action.payload.address, 
          fullName: action.payload.fullName, 
          phoneNumber: action.payload.phoneNumber 
        };
        state.success = true;
      })
      
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Adres güncellenemedi';
        state.success = false;
      });
  },
});

export const { logout, setToken, initializeToken, clearErrors } = authSlice.actions;
export default authSlice.reducer;
