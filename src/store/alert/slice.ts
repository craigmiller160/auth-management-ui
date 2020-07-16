import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    show: false,
    message: '',
    type: ''
};

type StateType = typeof initialState;

const showErrorAlert = (state: StateType, action: PayloadAction<string>) => {
    state.show = true;
    state.type = 'error';
    state.message = action.payload;
};

const showSuccessAlert = (state: StateType, action: PayloadAction<string>) => {
    state.show = true;
    state.type = 'success';
    state.message = action.payload;
};

const hideAlert = (state: StateType) => {
    state.show = false;
};

export default createSlice({
    name: 'alert',
    initialState,
    reducers: {
        showErrorAlert,
        showSuccessAlert,
        hideAlert
    }
});
