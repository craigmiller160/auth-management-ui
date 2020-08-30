import React from 'react';
import { useRouteMatch } from 'react-router';
import { useImmer } from 'use-immer';
import { PageHeader } from '../../../../ui/Header';

interface State {
    userId: number;
}

interface MatchParams {
    id: string;
}
const NEW = 'new';

const UserDetails = () => {
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW ? parseInt(id) : 0
    });

    return (
        <div className="UserDetails">
            <PageHeader title="User Details" />
        </div>
    );
}

export default UserDetails;
