import React from 'react';
import { exists, getOrElse, isNone, map, Option } from 'fp-ts/es6/Option';
import { UserClient, UserRole } from '../../../../../types/user';
import { SectionHeader } from '../../../../ui/Header';
import { Typography } from '@material-ui/core';
import List, { Item } from '../../../../ui/List';
import Button from '@material-ui/core/Button';
import { pipe } from 'fp-ts/es6/pipeable';
import { SelectDialog } from '../../../../ui/Dialog';
import { useImmer } from 'use-immer';
import { SelectOption } from '../../../../ui/Form/Autocomplete';

interface Props {
    selectedClient: Option<UserClient>;
    userId: number;
}

interface State {
    showAddRoleDialog: boolean;
    showRemoveRoleDialog: boolean;
    roleIdToRemove: number;
}

const UserRoles = (props: Props) => {
    const {
        selectedClient,
        userId
    } = props;
    const [state, setState] = useImmer<State>({
        showAddRoleDialog: false,
        showRemoveRoleDialog: false,
        roleIdToRemove: 0
    });

    if (isNone(selectedClient)) {
        return <div />;
    }

    const roleItems: Array<Item> = pipe(
        selectedClient,
        map((selected: UserClient) => selected.userRoles),
        getOrElse((): Array<UserRole> => [])
    )
        .map((role: UserRole) => ({
            click: () => {},
            text: {
                primary: role.name
            },
            secondaryActions: [
                {
                    text: 'Remove',
                    click: () => {}
                }
            ]
        }));

    const roleOptions: Array<SelectOption<number>> = pipe(
        selectedClient,
        map((client: UserClient) =>
            client.allRoles
                .filter((r1) => !client.userRoles.find((r2) => r1.id === r2.id))
        ),
        getOrElse((): Array<UserRole> => [])
    )
        .map((role: UserRole) => ({
            label: role.name,
            value: role.id
        }));

    const addRoleClick = () =>
        setState((draft) => {
            draft.showAddRoleDialog = true;
        });

    const addRoleOnCancel = () =>
        setState((draft) => {
            draft.showAddRoleDialog = false;
        });

    const addRoleOnSelect = (selectedRole: SelectOption<number>) => {
        setState((draft) => {
            draft.showAddRoleDialog = false;
        });
        // TODO finish this
    };

    return (
        <>
            <SectionHeader title="Roles" />
            {
                exists((selected: UserClient) => selected.allRoles.length === 0)(selectedClient) &&
                <Typography variant="h6">No Roles</Typography>
            }
            {
                exists((selected: UserClient) => selected.allRoles.length > 0)(selectedClient) &&
                <>
                    <List items={ roleItems } />
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={ addRoleClick }
                    >
                        Add Role
                    </Button>
                </>
            }
            <SelectDialog
                open={ state.showAddRoleDialog }
                title="Add Role"
                onSelect={ addRoleOnSelect }
                onCancel={ addRoleOnCancel }
                options={ roleOptions }
            />
        </>
    );
};

export default UserRoles;
