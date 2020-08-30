import React, { ChangeEvent } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router';
import { useImmer } from 'use-immer';
import { PageHeader } from '../../../../ui/Header';
import { Tabs } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import UserConfig from './UserConfig';
import UserGrants from './UserGrants';
import UserAuths from './UserAuths';

const TAB_CONFIG = 0;
const TAB_GRANTS = 1;
const TAB_AUTHS = 2;
const PATH_CONFIG = '/config';
const PATH_GRANTS = '/grants';
const PATH_AUTHS = '/auths';

interface State {
    userId: number; // TODO is this needed here?
    selectedTab: number;
}

interface MatchParams {
    id: string;
}
const NEW = 'new';

const getTabForPath = (pathname: string): number => {
    const parts = pathname.split('/')
    const end = `/${parts[parts.length - 1]}`;
    switch (end) {
        case PATH_AUTHS:
            return TAB_AUTHS;
        case PATH_GRANTS:
            return TAB_GRANTS;
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
        case TAB_CONFIG:
        default:
            return PATH_CONFIG;
    }
};

const UserDetails = () => {
    const history = useHistory();
    const location = useLocation();
    const match = useRouteMatch<MatchParams>();
    console.log(match); // TODO delete this
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW ? parseInt(id) : 0,
        selectedTab: getTabForPath(location.pathname)
    });

    const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
        setState((draft) => {
            draft.selectedTab = newValue;
        });
        const path = getPathForTab(newValue);
        const uri = `${match.path}${path}`;
        history.push(uri);
    };

    return (
        <div className="UserDetails">
            <PageHeader title="User Details" />
            <Tabs
                value={ state.selectedTab }
                indicatorColor="primary"
                textColor="primary"
                centered
                onChange={ handleTabChange }
            >
                <Tab label="Config" />
                <Tab label="Grants" />
                <Tab label="Authentications" />
            </Tabs>
            <Switch>
                <Route
                    path={ `${match.path}${PATH_CONFIG}` }
                    exact
                    component={ UserConfig }
                />
                <Route
                    path={ `${match.path}${PATH_GRANTS}` }
                    exact
                    component={ UserGrants }
                />
                <Route
                    path={ `${match.path}${PATH_AUTHS}` }
                    exact
                    component={ UserAuths }
                />
                <Redirect to={ `${match.path}${PATH_CONFIG}` } />
            </Switch>
        </div>
    );
}

export default UserDetails;
