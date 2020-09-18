import React from 'react';
import { ClientRole, ClientUser } from '../../../../../types/client';
import { useImmer } from 'use-immer';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import List, { Item } from '../../../../ui/List';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import { Button, Typography } from '@material-ui/core';
import { SelectDialog } from '../../../../ui/Dialog';

interface Props {
    selectedUser: ClientUser;
    removeRole: (roleId: number) => void;
    saveAddRole: (roleId: number) => void;
    allRoles: Array<ClientRole>;
}

interface State {
    showRoleDialog: boolean;
}

const ClientGrantRoles = (props: Props) => {
    const {
        selectedUser,
        removeRole,
        saveAddRole,
        allRoles
    } = props;

    const [state, setState] = useImmer<State>({
        showRoleDialog: false
    });

    const doSaveAddRole = (selected: SelectOption<number>) => {
        setState((draft) => {
            draft.showRoleDialog = false;
        });
        saveAddRole(selected.value);
    };

    const roleItems: Array<Item> = selectedUser.roles
        .map((role) => ({
            avatar: () => <AssignIcon />,
            text: {
                primary: role.name
            },
            secondaryActions: [
                {
                    text: 'Remove',
                    click: () => removeRole(role.id)
                }
            ]
        }));

    const roleOptions: Array<SelectOption<number>> = allRoles
        .filter((role) => {
            const index = selectedUser.roles.findIndex((uRole) => uRole.id === role.id);
            return index === -1;
        })
        .map((role) => ({
            value: role.id,
            label: role.name
        }));

    return (
        <>
            {
                roleItems.length > 0 &&
                <List items={ roleItems } />
            }
            {
                roleItems.length === 0 &&
                <Typography
                    className="no-items"
                    variant="body1"
                >
                    No Roles
                </Typography>
            }
            <Button
                variant="contained"
                color="primary"
                onClick={ () => setState((draft) => {
                    draft.showRoleDialog = true;
                }) }
                disabled={ roleOptions.length === 0 }
            >
                Add Role
            </Button>
            <SelectDialog
                label="Role"
                open={ state.showRoleDialog }
                title="Add Role"
                onSelect={ doSaveAddRole }
                onCancel={ () => setState((draft) => {
                    draft.showRoleDialog = false;
                }) }
                options={ roleOptions }
            />
        </>
    );
};

export default ClientGrantRoles;
