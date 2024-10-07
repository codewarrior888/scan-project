import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../components/api';

interface AuthState {
  login: string;
  password: string;
  accessToken: string | null;
  isAuthError: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  login: '',
  password: '',
  accessToken: null,
  isAuthError: false,
  isLoading: false,
};

// Проверка токена
export const checkToken = (): string | null => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const expire = localStorage.getItem('expire');
    if (accessToken && expire && new Date().getTime() < parseInt(expire)) {
      return accessToken;
    }
  } catch (error) {
    console.error('Ошибка проверки токена:', error);
  }
  return null;
};

// Асинхронный запрос AsyncThunk для логина
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ login, password }: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/account/login`, { login, password });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('login', login);
      let currentDate = new Date();
      let expire = currentDate.setDate(currentDate.getDate() + 1); // Задать срок действия токена на 1 день
      localStorage.setItem('expire', expire.toString());
      return accessToken;
    } catch (error) {
      // console.error("Ошибка аутентификации:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Создание слайса
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    logout: (state) => {
      state.login = '';
      state.password = '';
      state.accessToken = null;
      localStorage.clear();
    },

    resetAuthError: (state) => {
      state.isAuthError = false;
    },
  
    loadTokenFromStorage: (state) => {
      try {
        const token = checkToken();
        if (token) {
          state.accessToken = token;
        } else {
          state.accessToken = null;
        }
      } catch (error) {
        console.error('Ошибка получения токена из localStorage:', error);
        state.accessToken = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.isAuthError = false;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isLoading = false;
        state.isAuthError = true;
        localStorage.setItem('accessToken', '');
      });
  },
});

export const { setLogin, setPassword, logout, resetAuthError, loadTokenFromStorage } = authSlice.actions;
export default authSlice.reducer;