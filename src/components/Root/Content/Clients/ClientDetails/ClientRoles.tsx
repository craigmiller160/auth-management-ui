import React, { useEffect } from 'react';
import { Role } from '../../../../../types/role';
import { useImmer } from 'use-immer';
import { Grid, Typography } from '@material-ui/core';
import List, { Item } from '../../../../ui/List';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import { ClientRole } from '../../../../../types/client';
import { getRolesForClient } from '../../../../../services/ClientService';
import { pipe } from 'fp-ts/es6/pipeable';
import { getOrElse } from 'fp-ts/es6/Either';

interface Props {
    clientId: number;
}

interface State {
    showRoleDialog: boolean;
    selectedRoleId: number;
    showDeleteDialog: boolean;
    roles: Array<ClientRole>;
}

const ClientRoles = (props: Props) => {
    const {
        clientId
    } = props;
    const [state, setState] = useImmer<State>({
        showRoleDialog: false,
        showDeleteDialog: false,
        selectedRoleId: -1,
        roles: []
    });

    useEffect(() => {
        const load = async () => {
            const roles = pipe(
                await getRolesForClient(clientId),
                getOrElse((): Array<ClientRole> => [])
            );
            setState((draft) => {
                draft.roles = roles;
            });
        };

        load();
    });

    const selectRole = (role: ClientRole) => {
        // TODO finish this
    };

    const checkDelete = (role: ClientRole) => {
        // TODO finish this
    };

    const items: Array<Item> = state.roles.map((role) => ({
        avatar: () => <AssignIcon />,
        text: {
            primary: role.name
        },
        secondaryActions: [
            {
                text: 'Edit',
                click: () => selectRole(role)
            },
            {
                text: 'Delete',
                click: () => checkDelete(role)
            }
        ]
    }));


    return (
        <div className="ClientRoles">
            <Typography
                className="email"
                variant="h5"
            >
                { 'Placeholder For Client Name' }
            </Typography>
            <Grid
                container
                direction="column"
                justify="center"
            >

            </Grid>
        </div>
    );
};

export default ClientRoles;
