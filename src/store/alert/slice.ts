import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertState {
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

const initialState: AlertState = {
    show: false,
    message: '',
    type: 'success'
};

const showErrorAlert = (state: AlertState, action: PayloadAction<string>) => {
    state.show = true;
    state.type = 'error';
    state.message = action.payload;
};

const showSuccessAlert = (state: AlertState, action: PayloadAction<string>) => {
    state.show = true;
    state.type = 'success';
    state.message = action.payload;
};

const hideAlert = (state: AlertState) => {
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
