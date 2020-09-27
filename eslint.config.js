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

// TODO split the TS and normal JS rules apart properly

// noinspection NpmUsedModulesInstalled
const config = require('eslint-config-react-app');

const tsOverride = config.overrides
    .find((override) => override.parser === '@typescript-eslint/parser');

module.exports = {
    extends: [
        'react-app'
    ],
    rules: {
        ...config.rules,
        'semi': ['error', 'always'],
        'arrow-body-style': ['error', 'as-needed'],
        'comma-dangle': ['error', 'never'],
        'object-curly-newline': ['error', { consistent: true }],
        'max-len': [
            'error',
            {
                code: 120,
                ignoreComments: true
            }
        ],
        'no-console': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'no-fallthrough': 'error',
        'default-case': ['error', { commentPattern: '^no default$' }],
    },
    overrides: [
        {
            ...tsOverride,
            rules: {
                ...tsOverride.rules,
                'default-case': ['error', { commentPattern: '^no default$' }],
                '@typescript-eslint/no-unused-vars': 'error'
            }
        }
    ]
};