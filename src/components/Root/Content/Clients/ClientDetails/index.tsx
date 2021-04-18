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
import { useRouteMatch } from 'react-router';
import {
	PageHeader,
	TabConfig,
	Tabs
} from '@craigmiller160/react-material-ui-common';
import ClientConfig from './ClientConfig';
import ClientRoles from './ClientRoles';
import ClientGrants from './ClientGrants';
import ClientAuths from './ClientAuths';
import './ClientDetails.scss';
import { IdMatchParams, NEW_ID } from '../../../../../types/detailsPage';

const PATH_CONFIG = '/config';
const PATH_ROLES = '/roles';
const PATH_GRANTS = '/grants';
const PATH_AUTHS = '/auths';

const LABEL_CONFIG = 'Config';
const LABEL_ROLES = 'Roles';
const LABEL_GRANTS = 'Grants';
const LABEL_AUTHS = 'Authentications';

const ClientDetails = (): JSX.Element => {
	const match = useRouteMatch<IdMatchParams>();
	const { id } = match.params;

	const tabs: Array<TabConfig> = [
		{
			id: 'client-config-tab',
			label: LABEL_CONFIG,
			path: PATH_CONFIG,
			component: ClientConfig
		}
	];
	if (id !== NEW_ID) {
		tabs.push({
			id: 'client-roles-tab',
			label: LABEL_ROLES,
			path: PATH_ROLES,
			component: ClientRoles
		});
		tabs.push({
			id: 'client-grants-tab',
			label: LABEL_GRANTS,
			path: PATH_GRANTS,
			component: ClientGrants
		});
		tabs.push({
			id: 'client-auths-tab',
			label: LABEL_AUTHS,
			path: PATH_AUTHS,
			component: ClientAuths
		});
	}

	return (
		<div id="client-details-page" className="ClientDetails">
			<PageHeader
				id="client-details-page-header"
				title="Client Details"
			/>
			<Tabs id="client-details-tabs" tabs={tabs} />
		</div>
	);
};

export default ClientDetails;
