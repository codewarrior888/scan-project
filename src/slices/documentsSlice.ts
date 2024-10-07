import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../components/api';

interface DocumentsState {
  documents: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  isLoading: false,
  error: null,
};

// Асинхронный экшн AsyncThunk для получения документов.
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async ({ accessToken, ids }: { accessToken: string, ids: string[] }) => {
    const requestBody = {
      ids: ids
    };

    try {
      const response = await axios.post(`${API_URL}/documents`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "accept": "application/json",
        },
      });
      
      console.log("Documents Data:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Ошибка получения документов:", error);
      throw error;
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    // Очистка документов из стейта
    clearDocuments: (state) => {
      state.documents = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = [...state.documents, ...action.payload];
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch documents';
      });
  },
});

export const { clearDocuments } = documentsSlice.actions;

export default documentsSlice.reducer;