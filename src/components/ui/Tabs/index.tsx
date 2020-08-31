import React, { ChangeEvent, ComponentType } from 'react';
import MuiTabs from '@material-ui/core/Tabs';
import { useImmer } from 'use-immer';
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router';
import { Tab } from '@material-ui/core';

// Only designed at the moment to work with tabs at the end of the react router path

interface TabConfig {
    label: string;
    path: string;
    component: ComponentType<any>;
}

interface Props {
    tabs: TabConfig[]
}

interface State {
    selectedTab: number;
}

const tabPathMatch = (pathname: string, tabPath: string): boolean => {
    const parts = pathname.split('/');
    const end = `/${parts[parts.length - 1]}`;
    return end === tabPath;
};

const Tabs = (props: Props) => {
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();
    const [state, setState] = useImmer<State>({
        selectedTab: props.tabs.findIndex((tab) =>
            tabPathMatch(location.pathname, tab.path)) ?? 0
    });

    const handleTabChange = (event: ChangeEvent<{}>, newValue: number): void => {
        setState((draft) => {
            draft.selectedTab = newValue;
        });
        const path = props.tabs[newValue].path;
        const uri = `${match.url}${path}`;
        history.push(uri);
    };

    // TODO need to reset the route if something invalid is provided
    // TODO or just redirect to the default one

    return (
        <div className="TabsContainer">
            <MuiTabs
                className="Tabs"
                value={ state.selectedTab }
                indicatorColor="primary"
                textColor="primary"
                centered
                onChange={ handleTabChange }
            >
                {
                    props.tabs.map((tab, index) => (
                        <Tab key={ index } label={ tab.label } />
                    ))
                }
            </MuiTabs>
            <Switch>
                {
                    props.tabs.map((tab, index) => (
                        <Route
                            key={ index }
                            path={ `${match.path}${tab.path}` }
                            exact
                            component={ tab.component }
                        />
                    ))
                }
            </Switch>
        </div>
    );
};

export default Tabs;
