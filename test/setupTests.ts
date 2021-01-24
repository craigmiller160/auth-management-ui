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

import '@relmify/jest-fp-ts';
import '@craigmiller160/jest-matchers-common';
import '@testing-library/jest-dom/extend-expect';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

beforeEach(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
        assign: jest.fn(),
        pathname: '/',
        search: '',
        hash: '',
        href: ''
    };
});

configure({ adapter: new Adapter() });