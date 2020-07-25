import React from 'react';
import { Role } from '../../../../../types/api';
import { SectionHeader } from '../../../../ui/Header';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ClientRoleDialog from './ClientRoleDialog';
import { useImmer } from 'use-immer';
import { isSome, Option } from 'fp-ts/es6/Option';
import { createRole, deleteRole, updateRole } from '../../../../../services/ClientService';
import { ConfirmDialog } from '../../../../ui/Dialog';
import List, { Item } from '../../../../ui/List';

interface Props {
    clientId: number;
    roles: Array<Role>;
    reloadRoles: () => void;
}

interface State {
    showRoleDialog: boolean;
    selectedRole: Role;
    showDeleteDialog: boolean;
    roleIdToDelete: number;
}

const ClientRoles = (props: Props) => {
    const {
        clientId,
        roles,
        reloadRoles
    } = props;
    const [state, setState] = useImmer<State>({
        showRoleDialog: false,
        selectedRole: {
            id: 0,
            name: '',
            clientId
        },
        showDeleteDialog: false,
        roleIdToDelete: 0
    });

    const selectRole = (role: Role) => {
        setState((draft) => {
            draft.selectedRole = role;
            draft.showRoleDialog = true;
        });
    };

    const newRole = () =>
        setState((draft) => {
            draft.selectedRole = {
                id: 0,
                name: '',
                clientId
            };
            draft.showRoleDialog = true;
        });

    const closeRoleDialog = () => {
        setState((draft) => {
            draft.showRoleDialog = false;
        });
    };

    const saveRole = async (role: Role) => {
        setState((draft) => {
            draft.showRoleDialog = false;
        });
        let result: Option<Role>;
        if (role.id) {
            result = await updateRole(role.clientId, role.id, role);
        } else {
            result = await createRole(role.clientId, role);
        }

        if (isSome(result)) {
            reloadRoles();
        }
    };

    const doDeleteRole = async () => {
        setState((draft) => {
            draft.showDeleteDialog = false;
        });
        const result = await deleteRole(clientId, state.roleIdToDelete);
        if (isSome(result)) {
            reloadRoles();
        }
    };

    const checkDelete = (role: Role) => {
        setState((draft) => {
            draft.showRoleDialog = false;
        });

        setState((draft) => {
            draft.showDeleteDialog = true;
            draft.roleIdToDelete = role.id;
        });
    };

    const hideDeleteDialog = () =>
        setState((draft) => {
            draft.showDeleteDialog = false;
        });

    const items: Array<Item> = roles.map((role) => ({
        click: () => selectRole(role),
        avatar: () => <AssignIcon />,
        text: {
            primary: role.name
        },
        secondaryAction: {
            text: 'Delete',
            click: () => checkDelete(role)
        }
    }));

    return (
        <>
            <Grid
                item
                md={ 5 }
            >
                <SectionHeader title="Roles" />
                <List items={ items } />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ newRole }
                >
                    Add Role
                </Button>
            </Grid>
            <ClientRoleDialog
                role={ state.selectedRole }
                open={ state.showRoleDialog }
                onClose={ closeRoleDialog }
                onSave={ saveRole }
            />
            <ConfirmDialog
                open={ state.showDeleteDialog }
                title="Delete Role"
                message="Are you sure you want to delete this role?"
                onConfirm={ doDeleteRole }
                onCancel={ hideDeleteDialog }
            />
        </>
    );
};

export default ClientRoles;
