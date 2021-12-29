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

const cypress = require('cypress');
const { merge } = require('mochawesome-merge');
const fs = require('fs');
const path = require('path');
const reportGenerator = require('mochawesome-report-generator');
const opn = require('opn');
const cypressConfig = require('../cypress');

const MA_REPORT_DIR = 'test-reports/mochawesome-report';
const MA_REPORT_NAME = 'auth-ui-test-report.html';
const TEST_SUITE = 'cypress/integration/**/*';

const cwd = process.cwd();
const {
	reporterOptions: { reportDir },
	videosFolder,
	screenshotsFolder
} = cypressConfig;

const clearPastTests = () => {
	console.log('Clearing past test data'); // eslint-disable-line no-console
	fs.rmdirSync(path.resolve(cwd, reportDir), { recursive: true });
	fs.rmdirSync(path.resolve(cwd, videosFolder), { recursive: true });
	fs.rmdirSync(path.resolve(cwd, screenshotsFolder), { recursive: true });
	fs.rmdirSync(path.resolve(cwd, MA_REPORT_DIR), { recursive: true });
};

const runCypress = async () => {
	/* eslint-disable-next-line no-unused-vars */
	const results = await cypress.run({
		headless: true,
		browser: 'chrome',
		spec: TEST_SUITE
	});

	const report = await merge({
		files: [path.resolve(cwd, reportDir, '*.json')]
	});
	await reportGenerator.create(report, {
		reportDir: path.resolve(cwd, MA_REPORT_DIR),
		reportFilename: MA_REPORT_NAME
	});
};

clearPastTests();
runCypress()
	.then(() => {
		const reportFile = path.resolve(cwd, MA_REPORT_DIR, MA_REPORT_NAME);
		opn(reportFile);
	})
	.catch((error) => {
		console.log('Error executing test suite', error); // eslint-disable-line no-console
		process.exit(1);
	});
