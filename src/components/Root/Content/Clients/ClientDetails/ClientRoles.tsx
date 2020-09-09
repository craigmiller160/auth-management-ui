import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { Grid, Typography } from '@material-ui/core';
import List, { Item } from '../../../../ui/List';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import { ClientRole } from '../../../../../types/client';
import { getClientWithRoles } from '../../../../../services/ClientService';
import { pipe } from 'fp-ts/es6/pipeable';
import { map } from 'fp-ts/es6/Either';
import { match } from 'react-router';
import './ClientRoles.scss';
import Button from '@material-ui/core/Button';
import ClientRoleDialog from './ClientRoleDialog';
import { InputDialog } from '../../../../ui/Dialog';

const ROLE_PREFIX = 'ROLE_';

const NEW = 'new';
interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

interface State {
    showRoleDialog: boolean;
    selectedRoleIndex: number;
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
        selectedRoleIndex: -1,
        clientName: '',
        roles: [],
        clientId: id !== NEW ? parseInt(id) : 0
    });

    const loadClientRoles = async () => {
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

    useEffect(() => {
        loadClientRoles();
    }, []);

    const selectRole = (index: number) => {
        setState((draft) => {
            draft.selectedRoleIndex = index;
            draft.showRoleDialog = true;
        });
    };

    const checkDelete = (index: number) => {
        // TODO finish this
    };

    const saveRole = (value: string) => {
        const roleName = `${ROLE_PREFIX}${value}`;
        console.log('Role', roleName); // TODO delete this
        setState((draft) => {
            draft.selectedRoleIndex = -1;
            draft.showRoleDialog = false;
        });
    };

    const cancelRoleDialog = () =>
        setState((draft) => {
            draft.showRoleDialog = false;
            draft.selectedRoleIndex = -1;
        });

    const items: Array<Item> = state.roles.map((role, index) => ({
        avatar: () => <AssignIcon />,
        text: {
            primary: role.name
        },
        secondaryActions: [
            {
                text: 'Edit',
                click: () => selectRole(index)
            },
            {
                text: 'Delete',
                click: () => checkDelete(index)
            }
        ]
    }));

    const getSelectedRole = () => {
        if (state.selectedRoleIndex >= 0) {
            return state.roles[state.selectedRoleIndex].name
                .replace(ROLE_PREFIX, '');
        }

        return '';
    };

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
                direction="row"
                justify="center"
            >
                <Grid
                    item
                    md={ 5 }
                >
                    {
                        items.length > 0 &&
                        <List items={ items } />
                    }
                    {
                        items.length === 0 &&
                        <Typography
                            className="no-roles"
                            variant="body1"
                        >
                            No Roles
                        </Typography>
                    }
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
            >
                <Grid
                    item
                    md={ 5 }
                >
                    <Button
                        className="AddRole"
                        color="primary"
                        variant="contained"
                    >
                        Add Role
                    </Button>
                </Grid>
            </Grid>
            <InputDialog
                open={ state.showRoleDialog }
                title="Role"
                onCancel={ cancelRoleDialog }
                onSave={ saveRole }
                label="Role"
                transform={ (value: string) => value?.toUpperCase() ?? '' }
                prefix={ ROLE_PREFIX }
                initialValue={ getSelectedRole() }
            />
        </div>
    );
};

export default ClientRoles;
