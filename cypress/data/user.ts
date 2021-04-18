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

import { InsertUser } from '../plugins/sql/insertUser';

export const testUser: InsertUser = {
	email: 'test@gmail.com',
	firstName: 'Test',
	lastName: 'User',
	password: 'password',
	enabled: true
};

export const testUser2: InsertUser = {
	email: 'test2@gmail.com',
	firstName: 'Test2',
	lastName: 'User',
	password: 'password',
	enabled: true
};
