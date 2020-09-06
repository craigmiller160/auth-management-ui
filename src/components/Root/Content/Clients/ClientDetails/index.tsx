import React, { ComponentType } from 'react';
import { useRouteMatch } from 'react-router';
import ClientConfig from './ClientConfig';
import { PageHeader } from '../../../../ui/Header';
import ClientRoles from './ClientRoles';
import ClientGrants from './ClientGrants';
import ClientAuths from './ClientAuths';
import Tabs, { TabConfig } from '../../../../ui/Tabs';
import './ClientDetails.scss';

const PATH_CONFIG = '/config';
const PATH_ROLES = '/roles';
const PATH_GRANTS = '/grants';
const PATH_AUTHS = '/auths';

const LABEL_CONFIG = 'Config';
const LABEL_ROLES = 'Roles';
const LABEL_GRANTS = 'Grants';
const LABEL_AUTHS = 'Authentications';

interface MatchParams {
    id: string;
}
const NEW = 'new';

interface RouteConfig {
    path: string;
    component: ComponentType<any>;
}

const ClientDetails = () => {
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;

    const tabs: Array<TabConfig> = [
        {
            label: LABEL_CONFIG,
            path: PATH_CONFIG,
            component: ClientConfig
        }
    ];
    if (id !== NEW) {
        tabs.push({
            label: LABEL_ROLES,
            path: PATH_ROLES,
            component: ClientRoles
        });
        tabs.push({
            label: LABEL_GRANTS,
            path: PATH_GRANTS,
            component: ClientGrants
        });
        tabs.push({
            label: LABEL_AUTHS,
            path: PATH_AUTHS,
            component: ClientAuths
        });
    }

    return (
        <div className="ClientDetails">
            <PageHeader title="Client Details" />
            <Tabs tabs={ tabs } />
        </div>
    );
};

export default ClientDetails;
