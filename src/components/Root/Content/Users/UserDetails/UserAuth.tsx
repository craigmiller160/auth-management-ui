import React from 'react';
import { SectionHeader } from '../../../../ui/Header';
import { UserClient } from '../../../../../types/user';

interface Props {
    clients: Array<UserClient>;
    userId: number;
}

interface State {

}

const UserAuth = (props: Props) => {
    const {
        userId,
        clients
    } = props;

    return (
        <>
            <SectionHeader title="Authentication" />
        </>
    );
};

export default UserAuth;
