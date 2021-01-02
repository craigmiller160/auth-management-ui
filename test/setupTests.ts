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

import { Either, Left, Right } from 'fp-ts/es6/Either';
import '@relmify/jest-fp-ts';

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

// TODO move this to library
expect.extend({
    stringsToEqualIgnoreWhitespace(received: string, expected: string) {
        if (typeof received !== 'string') {
            return {
                message: () => 'Received value is not a string',
                pass: false
            };
        }
        if (typeof expected !== 'string') {
            return {
                message: () => 'Expected value is not a string',
                pass: false
            };
        }
        const receivedNoWhitespace = received.trim().replace(/\s/g, '');
        const expectedNoWhitespace = expected.trim().replace(/\s/g, '');
        const pass = receivedNoWhitespace === expectedNoWhitespace;
        if (pass) {
            return {
                message: () => '',
                pass: true
            };
        }
        return {
            message: () => 'Expected strings to be equal if ignoring whitespace',
            pass: false
        };
    }
});

// TODO move to testing library
// expect.extend({
//     eitherRightEquals<R>(received: Either<any, R>, expected: R) {
//         try {
//             expect(received._tag).toEqual('Right');
//             expect((received as Right<R>).right).toEqual(expected);
//             return {
//                 message: () => 'Either "right" value is correct',
//                 pass: true
//             };
//         } catch (ex) {
//             return {
//                 message: () => ex.message,
//                 pass: false
//             };
//         }
//     }
// });
//
// // TODO move to testing library
// expect.extend({
//     eitherLeftEquals<L>(received: Either<L,any>, expected: L) {
//         try {
//             expect(received._tag).toEqual('Left');
//             expect((received as Left<L>).left).toEqual(expected);
//             return {
//                 message: () => 'Either "left" value is correct',
//                 pass: true
//             };
//         } catch (ex) {
//             return {
//                 message: () => ex.message,
//                 pass: false
//             };
//         }
//     }
// })
