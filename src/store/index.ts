import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import alertSlice from './alert/slice';
import authSlice from './auth/slice';

const rootReducer = combineReducers({
    alert: alertSlice.reducer,
    auth: authSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>

export default configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
});
