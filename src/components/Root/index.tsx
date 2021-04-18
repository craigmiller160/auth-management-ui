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

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from './Content';
import { loadAuthUser } from '../../store/auth/actions';
import { RootState } from '../../store';
import AuthNavbar from './AuthNavbar';

const Root = (): JSX.Element => {
	const dispatch = useDispatch();
	const hasChecked = useSelector((state: RootState) => state.auth.hasChecked);
	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<div>
			<AuthNavbar />
			{hasChecked && <Content />}
		</div>
	);
};

export default Root;
