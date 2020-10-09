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

const { CLIEngine } = require('eslint');
const path = require('path');

// TODO if it works, move it to the eslint library.
// TODO also downgrade that lib's eslint version to 6.8.x

(async () => {
    try {
        const eslint = new CLIEngine({
            errorOnUnmatchedPattern: false,
            configFile: path.resolve(process.cwd(), 'eslint.config.js')
        });
        const report = eslint.executeOnFiles(['src']);

        const formatter = eslint.getFormatter("stylish");
        const resultText = formatter(report.results);

        console.log(resultText);
    } catch (ex) {
        console.error(ex);
        process.exitCode = 1;
    }
})();

