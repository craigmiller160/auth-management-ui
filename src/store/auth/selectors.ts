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

import { createSelector } from '@reduxjs/toolkit';
import { AuthUser } from '../../types/auth';
import { Option, isSome } from 'fp-ts/es6/Option';
import { RootState } from '../index';

const userDataSelector = (state: RootState): Option<AuthUser> => state.auth.userData;

export const isAuthorized = createSelector(
    userDataSelector,
    (userData: Option<AuthUser>) => isSome(userData)
);
