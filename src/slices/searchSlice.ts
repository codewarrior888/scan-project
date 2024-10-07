import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface SearchState {
  inn: string | null;
  tonality: string;
  limit: number;
  startDate: string | null;
  endDate: string | null;
  searchFormChecks: {
    isFullness: boolean;
    isBusiness: boolean;
    isMainRole: boolean;
    isRisksOnly: boolean;
    isTechNews: boolean;
    isAnnouncement: boolean;
    isNews: boolean;
  };
}

const initialState: SearchState = {
  inn: null,
  tonality: 'any',
  limit: 0,
  startDate: null,
  endDate: null,
  searchFormChecks: {
    isFullness: false,
    isBusiness: false,
    isMainRole: false,
    isRisksOnly: false,
    isTechNews: false,
    isAnnouncement: false,
    isNews: false,
  },
};

// Слайс для хранения состояния параметров поиска
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setInn(state, action: PayloadAction<string | null>) {
      state.inn = action.payload;
    },
    setTonality(state, action: PayloadAction<string>) {
      state.tonality = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setStartDate: {
      reducer(state, action: PayloadAction<string | null>) {
        state.startDate = action.payload;
      },
      prepare(date: string | null) {
        return {
          payload: date,
        };
      },
    },
    setEndDate: {
      reducer(state, action: PayloadAction<string | null>) {
        state.endDate = action.payload;
      },
      prepare(date: string | null) {
        return {
          payload: date,
        };
      },
    },
    setSearchFormChecks(
      state,
      action: PayloadAction<Partial<SearchState['searchFormChecks']>>
    ) {
      state.searchFormChecks = {
        ...state.searchFormChecks,
        ...action.payload,
      };
    },
  },
});

export const {
  setInn,
  setTonality,
  setLimit,
  setStartDate,
  setEndDate,
  setSearchFormChecks,
} = searchSlice.actions;

export const selectSearch = (state: RootState) => state.search;

export default searchSlice.reducer;