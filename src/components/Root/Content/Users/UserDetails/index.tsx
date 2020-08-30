import React from 'react';
import { useRouteMatch } from 'react-router';
import { useImmer } from 'use-immer';
import { PageHeader } from '../../../../ui/Header';
import { Tabs } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';

const TAB_CONFIG = 0;
const TAB_GRANTS = 1;
const TAB_AUTHS = 2;

interface State {
    userId: number;
    selectedTab: number;
}

interface MatchParams {
    id: string;
}
const NEW = 'new';

const UserDetails = () => {
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW ? parseInt(id) : 0,
        selectedTab: TAB_CONFIG
    });

    return (
        <div className="UserDetails">
            <PageHeader title="User Details" />
            <Tabs
                value={ state.selectedTab }
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Config" />
                <Tab label="Grants" />
                <Tab label="Authentications" />
            </Tabs>
        </div>
    );
}

export default UserDetails;
