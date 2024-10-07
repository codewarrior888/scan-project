import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import userInfoSlice from '../slices/userInfoSlice';
import histogramReducer from '../slices/histogramSlice';
import documentsReducer from '../slices/documentsSlice';
import idsReducer from '../slices/idsSlice';
import searchReducer from '../slices/searchSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userInfoSlice,
  histogram: histogramReducer,
  documents: documentsReducer,
  ids: idsReducer,
  search: searchReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;