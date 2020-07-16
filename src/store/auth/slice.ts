import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../../types/api';
import { none, Option } from 'fp-ts/es6/Option';

const initialState: StateType = {
    userData: none
};

interface StateType {
    userData: Option<AuthUser>
}

const setUserData = (state: StateType, action: PayloadAction<Option<AuthUser>>) => {
    state.userData = action.payload;
};

export default createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData
    }
});
