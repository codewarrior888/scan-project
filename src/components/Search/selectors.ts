import { createSelector } from 'reselect';
import { RootState } from '../../app/store';

// Input selector
const selectSearch = (state: RootState) => state.search;

// Memoized selector for startDate and endDate
export const selectSearchDates = createSelector(
  [selectSearch],
  (search) => ({
    startDate: search.startDate ? new Date(search.startDate) : null,
    endDate: search.endDate ? new Date(search.endDate) : null,
  })
);