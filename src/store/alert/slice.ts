import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    show: false,
    message: '',
    type: ''
};

export default createSlice({
    name: 'alert',
    initialState,
    reducers: {

    }
});
