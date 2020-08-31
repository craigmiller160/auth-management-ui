import React, { ComponentType } from 'react';
import { useRouteMatch } from 'react-router';
import { PageHeader } from '../../../../ui/Header';
import UserConfig from './UserConfig';
import UserGrants from './UserGrants';
import UserAuths from './UserAuths';
import './UserDetails.scss';
import Tabs, { TabConfig } from '../../../../ui/Tabs';

const PATH_CONFIG = '/config';
const PATH_GRANTS = '/grants';
const PATH_AUTHS = '/auths';

const LABEL_CONFIG = 'Config';
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

const UserDetails = () => {
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;

    const tabs: Array<TabConfig> = [
        {
            label: LABEL_CONFIG,
            path: PATH_CONFIG,
            component: UserConfig
        }
    ];
    if (id !== NEW) {
        tabs.push({
            label: LABEL_GRANTS,
            path: PATH_GRANTS,
            component: UserGrants
        });
        tabs.push({
            label: LABEL_AUTHS,
            path: PATH_AUTHS,
            component: UserAuths
        });
    }

    return (
        <div className="UserDetails">
            <PageHeader title="User Details" />
            <Tabs tabs={ tabs } />
        </div>
    );
}

export default UserDetails;
