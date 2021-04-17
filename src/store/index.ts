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

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { reduxAlertReducer } from '@craigmiller160/react-material-ui-common';
import authSlice from './auth/slice';

const rootReducer = combineReducers({
	alert: reduxAlertReducer,
	auth: authSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== 'production'
});
