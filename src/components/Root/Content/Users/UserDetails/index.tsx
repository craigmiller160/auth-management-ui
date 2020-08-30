import React, { ChangeEvent } from 'react';
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

    const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
        setState((draft) => {
            draft.selectedTab = newValue;
        });
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
        </div>
    );
}

export default UserDetails;
