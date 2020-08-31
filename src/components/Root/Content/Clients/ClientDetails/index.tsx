import React, { ChangeEvent, ComponentType } from 'react';
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router';
import { useImmer } from 'use-immer';
import ClientConfig from './ClientConfig';
import UserRoles from '../../Users/UserDetails/UserRoles';
import UserGrants from '../../Users/UserDetails/UserGrants';
import UserAuths from '../../Users/UserDetails/UserAuths';
import { PageHeader } from '../../../../ui/Header';
import { Tabs } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';

const TAB_CONFIG = 0;
const TAB_ROLES = 1;
const TAB_GRANTS = 2;
const TAB_AUTHS = 3;

const PATH_CONFIG = '/config';
const PATH_ROLES = '/roles';
const PATH_GRANTS = '/grants';
const PATH_AUTHS = '/auths';

interface State {
    selectedTab: number;
}

interface MatchParams {
    id: string;
}
const NEW = 'new';

const getTabForPath = (pathname: string): number => {
    const parts = pathname.split('/');
    const end = `/${parts[parts.length - 1]}`;
    switch (end) {
        case PATH_AUTHS:
            return TAB_AUTHS;
        case PATH_GRANTS:
            return TAB_GRANTS;
        case PATH_ROLES:
            return TAB_ROLES;
        case PATH_CONFIG:
        default:
            return TAB_CONFIG;
    }
};

const getPathForTab = (tabIndex: number): string => {
    switch (tabIndex) {
        case TAB_AUTHS:
            return PATH_AUTHS;
        case TAB_GRANTS:
            return PATH_GRANTS;
        case TAB_ROLES:
            return PATH_ROLES;
        case TAB_CONFIG:
        default:
            return PATH_CONFIG;
    }
};

interface RouteConfig {
    path: string;
    component: ComponentType<any>;
}

const ClientDetails = () => {
    const history = useHistory();
    const location = useLocation();
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        selectedTab: getTabForPath(location.pathname)
    });

    const handleTabChange = (event: ChangeEvent<{}>, newValue: number): void => {
        setState((draft) => {
            draft.selectedTab = newValue;
        });
        const path = getPathForTab(newValue);
        const uri = `${match.url}${path}`;
        history.push(uri);
    };

    const tabs: Array<string> = ['Config'];
    const routes: Array<RouteConfig> = [
        {
            path: `${match.path}${PATH_CONFIG}`,
            component: ClientConfig
        }
    ];
    if (id !== NEW) {
        tabs.push('Roles');
        tabs.push('Grants');
        tabs.push('Authentications');

        routes.push({
            path: `${match.path}${PATH_ROLES}`,
            component: UserRoles
        });
        routes.push({
            path: `${match.path}${PATH_GRANTS}`,
            component: UserGrants
        });
        routes.push({
            path: `${match.path}${PATH_AUTHS}`,
            component: UserAuths
        });
    }

    return (
        <div className="ClientDetails">
            <PageHeader title="Client Details" />
            <Tabs
                className="Tabs"
                value={ state.selectedTab }
                indicatorColor="primary"
                textColor="primary"
                centered
                onChange={ handleTabChange }
            >
                {
                    tabs.map((tab, index) => (
                        <Tab key={ index } label={ tab } />
                    ))
                }
            </Tabs>
            <Switch>
                {
                    routes.map((route, index) => (
                        <Route
                            key={ index }
                            path={ route.path }
                            exact
                            component={ route.component }
                        />
                    ))
                }
            </Switch>
        </div>
    );
};

export default ClientDetails;
