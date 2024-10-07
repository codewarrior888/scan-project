import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../components/api';

interface UserState {
  used: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  used: 0,
  limit: 0,
  isLoading: false,
  error: null,
};

// Получить информацию о пользователе
export const fetchUserInfo = createAsyncThunk(
  'user/fetchInfo',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/account/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.eventFiltersInfo;
    } catch (error) {
      
      return rejectWithValue(
        error.response && error.response.data ? error.response.data.message : 'Произошла ошибка, попробуйте позже'
      );
    }
  }
);

const userInfoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.used = action.payload.usedCompanyCount;
        state.limit = action.payload.companyLimit;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userInfoSlice.reducer;