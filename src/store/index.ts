import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import alertSlice from './alert/slice';

const rootReducer = combineReducers({
    alert: alertSlice.reducer
});

export default configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
});
