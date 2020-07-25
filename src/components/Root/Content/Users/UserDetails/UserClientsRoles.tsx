import React from 'react';
import { SectionHeader } from '../../../../ui/Header';

interface Props {
    clients: object;
}

const UserClientsRoles = (props: Props) => {
    const {
        clients
    } = props;

    return (
        <div>
            <SectionHeader title="Clients & Roles" />
        </div>
    );
};

export default UserClientsRoles;
