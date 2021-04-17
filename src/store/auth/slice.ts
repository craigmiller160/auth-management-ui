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
import { none, Option } from 'fp-ts/es6/Option';
import { AuthUser } from '../../types/auth';

interface StateType {
  csrfToken: Option<string>;
  userData: Option<AuthUser>;
  hasChecked: boolean;
}

export const initialState: StateType = {
  csrfToken: none,
  userData: none,
  hasChecked: false,
};

const setUserData = (
  draft: StateType,
  action: PayloadAction<Option<AuthUser>>,
) => {
  draft.userData = action.payload;
  draft.hasChecked = true;
};

const setCsrfToken = (
  draft: StateType,
  action: PayloadAction<Option<string>>,
) => {
  draft.csrfToken = action.payload;
};

export default createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData,
    setCsrfToken,
  },
});
