import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../../types/oldApi';
import { none, Option } from 'fp-ts/es6/Option';

const initialState: StateType = {
    userData: none,
    hasChecked: false
};

interface StateType {
    userData: Option<AuthUser>,
    hasChecked: boolean;
}

const setUserData = (state: StateType, action: PayloadAction<Option<AuthUser>>) => {
    state.userData = action.payload;
    state.hasChecked = true;
};

export default createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData
    }
});
