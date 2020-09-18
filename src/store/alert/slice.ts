/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
