import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { Grid, Typography } from '@material-ui/core';
import { Item } from '../../../../ui/List';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import { ClientRole } from '../../../../../types/client';
import { getClientWithRoles } from '../../../../../services/ClientService';
import { pipe } from 'fp-ts/es6/pipeable';
import { map } from 'fp-ts/es6/Either';
import { match } from 'react-router';
import './ClientRoles.scss';

const NEW = 'new';
interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

interface State {
    showRoleDialog: boolean;
    selectedRoleId: number;
    showDeleteDialog: boolean;
    clientName: string;
    roles: Array<ClientRole>;
    clientId: number;
}

const ClientRoles = (props: Props) => {
    const id = props.match.params.id;
    const [state, setState] = useImmer<State>({
        showRoleDialog: false,
        showDeleteDialog: false,
        selectedRoleId: -1,
        clientName: '',
        roles: [],
        clientId: id !== NEW ? parseInt(id) : 0
    });

    useEffect(() => {
        const load = async () => {
            pipe(
                await getClientWithRoles(state.clientId),
                map((clientRoles) => {
                    setState((draft) => {
                        draft.roles = clientRoles.roles;
                        draft.clientName = clientRoles.name;
                        draft.clientId = clientRoles.id;
                    });
                })
            );
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
                className="name"
                variant="h5"
            >
                { state.clientName }
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
