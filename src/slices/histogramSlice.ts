import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../components/api';
import { RootState } from '../app/rootReducer';

interface HistogramItem {
  date: string;
  value: number;
}

interface HistogramData {
  data: HistogramItem[];
  histogramType: string;
}

interface HistogramState {
  data: HistogramData[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HistogramState = {
  data: [],
  isLoading: false,
  error: null,
};

// Асинхронный экшн AsyncThunk для получения общей сводки.
export const fetchHistogramData = createAsyncThunk(
  'histogram/fetchHistogramData',
  async (accessToken: string, { getState }) => {
    const state = getState() as RootState;
    const { startDate, endDate, inn, tonality, searchFormChecks, limit } = state.search;

    const requestBody = {
      intervalType: 'month',
      histogramTypes: ['totalDocuments', 'riskFactors'],
      issueDateInterval: {
        startDate,
        endDate,
      },
      searchContext: {
        targetSearchEntitiesContext: {
          targetSearchEntities: [
            {
              type: 'company',
              sparkId: null,
              entityId: null,
              inn,
              maxFullness: searchFormChecks.isFullness,
              inBusinessNews: searchFormChecks.isBusiness,
            },
          ],
          onlyMainRole: searchFormChecks.isMainRole,
          tonality,
          onlyWithRiskFactors: searchFormChecks.isRisksOnly,
          riskFactors: { and: [], or: [], not: [] },
          themes: { and: [], or: [], not: [] },
        },
        themesFilter: { and: [], or: [], not: [] },
      },
      // searchArea: {
      //   includedSources: [],
      //   excludedSources: [],
      //   includedSourceGroups: [],
      //   excludedSourceGroups: [],
      // },
      similarMode: 'duplicates',
      limit,
      sortType: 'issueDate',
      sortDirectionType: 'asc',
      attributeFilters: {
        excludeTechNews: searchFormChecks.isTechNews,
        excludeAnnouncements: searchFormChecks.isAnnouncement,
        excludeDigests: searchFormChecks.isNews,
      },
    };

    const response = await axios
      .post(`${API_URL}/objectsearch/histograms`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          // accept: 'application/json',
        },
      })
      .then((response) => {
        console.log('Histogram Data:', response.data);
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      });
    return response;
  }
);

const histogramSlice = createSlice({
  name: 'histogram',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistogramData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistogramData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.data = action.payload.data;
        } else {
          state.data = [];
        }
      })
      .addCase(fetchHistogramData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при получении общей сводки';
      });
  },
});

export const selectHistogramData = (state: RootState): HistogramState => state.histogram;

export default histogramSlice.reducer;