import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../components/api';
import { RootState } from '../app/store';

interface IDsState {
  ids: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IDsState = {
  ids: [],
  isLoading: false,
  error: null,
};

// Асинхронный экшн AsyncThunk для получения ID документов.
export const fetchIds = createAsyncThunk(
  'ids/fetchIds',
  async (accessToken: string, { getState }) => {
    const state = getState() as RootState;
    const { startDate, endDate, inn, tonality, searchFormChecks, limit } = state.search;
    const requestBody = {
      intervalType: "month",
      histogramTypes: ["totalDocuments", "riskFactors"],
      issueDateInterval: {
        startDate: startDate,
        endDate: endDate,
      },
      searchContext: {
        targetSearchEntitiesContext: {
          targetSearchEntities: [
            {
              type: "company",
              sparkId: null,
              entityId: null,
              inn: inn,
              maxFullness: searchFormChecks.isFullness,
              inBusinessNews: searchFormChecks.isBusiness,
            },
          ],
          onlyMainRole: searchFormChecks.isMainRole,
          tonality: tonality,
          onlyWithRiskFactors: searchFormChecks.isRisksOnly,
          riskFactors: {
            and: [],
            or: [],
            not: [],
          },
          themes: {
            and: [],
            or: [],
            not: [],
          },
        },
        themesFilter: {
          and: [],
          or: [],
          not: [],
        },
      },
      // searchArea: {
      //   includedSources: [],
      //   excludedSources: [],
      //   includedSourceGroups: [],
      //   excludedSourceGroups: [],
      // },
      similarMode: "duplicates",
      limit: limit,
      sortType: "issueDate",
      sortDirectionType: "asc",
      attributeFilters: {
        excludeTechNews: searchFormChecks.isTechNews,
        excludeAnnouncements: searchFormChecks.isAnnouncement,
        excludeDigests: searchFormChecks.isNews,
      },
    };
    try {
      const response = await axios.post(`${API_URL}/objectsearch`, requestBody,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          // "accept": "application/json",
        },
      })
      const items = response.data.items;
      const ids = items.map((item) => item.encodedId);
      // console.log("Данные ID:", ids);
      return ids;
    } catch (error) {
      console.error("Ошибка получения ID:", error);
      throw error;
    }
  }
);

const idsSlice = createSlice({
  name: 'ids',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ids = action.payload;
      })
      .addCase(fetchIds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при получении ID документов';
      });
  },
});

export const selectIDs = (state: RootState) => state.ids;

export default idsSlice.reducer;