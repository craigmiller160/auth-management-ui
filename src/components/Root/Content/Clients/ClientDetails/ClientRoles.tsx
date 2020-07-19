import React from 'react';
import { Role } from '../../../../../types/api';
import { SectionHeader } from '../../../../ui/Header';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import theme from '../../../../theme';
import Button from '@material-ui/core/Button';
import ClientRoleDialog from './ClientRoleDialog';
import { useImmer } from 'use-immer';
import { isSome, Option } from 'fp-ts/es6/Option';
import { createRole, deleteRole, updateRole } from '../../../../../services/ClientService';
import { ConfirmDialog } from '../../../../ui/Dialog';

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

const useStyles = makeStyles({
    ListItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.light
        }
    }
});

const ClientRoles = (props: Props) => {
    const {
        clientId,
        roles,
        reloadRoles
    } = props;
    const classes = useStyles();
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

    return (
        <>
            <Grid
                item
                md={ 5 }
            >
                <SectionHeader title="Roles" />
                <List>
                    {
                        roles.map((role, index) => (
                            <ListItem
                                key={ index }
                                className={ classes.ListItem }
                                onClick={ () => selectRole(role) }
                            >
                                <ListItemAvatar>
                                    <AssignIcon />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={ role.name }
                                />
                            </ListItem>
                        ))
                    }
                </List>
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
                onDelete={ checkDelete }
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
