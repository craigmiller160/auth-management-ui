import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({

});

export default configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
});
