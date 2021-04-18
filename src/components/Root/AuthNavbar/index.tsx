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

import React from 'react';
import { Navbar, NavbarItem } from '@craigmiller160/react-material-ui-common';
import { useDispatch, useSelector } from 'react-redux';
import { none } from 'fp-ts/es6/Option';
import { isAuthorized } from '../../../store/auth/selectors';
import { RootState } from '../../../store';
import { login, logout } from '../../../services/AuthService';
import authSlice from '../../../store/auth/slice';

const AuthNavbar = () => {
	const isAuth = useSelector(isAuthorized);
	const dispatch = useDispatch();
	const hasChecked = useSelector((state: RootState) => state.auth.hasChecked);

	const items: Array<NavbarItem> = [
		{
			to: '/users',
			text: 'Users'
		},
		{
			to: '/clients',
			text: 'Clients'
		}
	];

	const doLogout = async () => {
		await logout()();
		dispatch(authSlice.actions.setUserData(none));
	};

	return (
		<Navbar
			isAuth={isAuth}
			showAuthBtn={hasChecked}
			login={() => login()()}
			logout={doLogout}
			title="OAuth Management"
			items={items}
		/>
	);
};

export default AuthNavbar;
