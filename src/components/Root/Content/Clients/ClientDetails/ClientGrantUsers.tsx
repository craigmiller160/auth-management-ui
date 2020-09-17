import React, { MouseEvent } from 'react';
import List, { Item } from '../../../../ui/List';
import PersonIcon from '@material-ui/icons/Person';
import { exists, Option, some } from 'fp-ts/es6/Option';
import { ClientUser } from '../../../../../types/client';
import { useHistory } from 'react-router';
import { UserDetails } from '../../../../../types/user';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { SectionHeader } from '../../../../ui/Header';
import { Button, Grid, Typography } from '@material-ui/core';
import { useImmer } from 'use-immer';
import { SelectDialog } from '../../../../ui/Dialog';

interface Props {
    clientUsers: Array<ClientUser>;
    selectUser: (user: ClientUser) => void;
    removeUser: (userId: number) => void;
    selectedUser: Option<ClientUser>;
    allUsers: Array<UserDetails>;
    saveAddUser: (userId: number) => void;
}

interface State {
    showUserDialog: boolean;
}

const ClientGrantUsers = (props: Props) => {
    const history = useHistory();
    const {
        clientUsers,
        selectUser,
        removeUser,
        selectedUser,
        allUsers,
        saveAddUser
    } = props;

    const [state, setState] = useImmer<State>({
        showUserDialog: false
    });

    const userItems: Array<Item> = clientUsers
        .map((user) => ({
            avatar: () => <PersonIcon />,
            click: () => selectUser(user),
            active: exists((selected: ClientUser) => selected.id === user.id)(selectedUser),
            text: {
                primary: `${user.firstName} ${user.lastName}`,
                secondary: user.roles.map((role) => role.name).join(', ')
            },
            secondaryActions: [
                {
                    text: 'Go',
                    click: () => history.push(`/users/${user.id}`)
                },
                {
                    text: 'Remove',
                    click: (event: MouseEvent) => {
                        event.stopPropagation();
                        removeUser(user.id);
                    }
                }
            ]
        }));

    const availableUserOptions:  Array<SelectOption<number>> = allUsers
        .filter((user) => {
            const index = clientUsers.findIndex((cUser) => cUser.id === user.id);
            return index === -1;
        })
        .map((user) => ({
            value: user.id,
            label: user.email
        }));

    const doSaveAddUser = (selected: SelectOption<number>) => {
        setState((draft) => {
            draft.showUserDialog = false;
        });
        saveAddUser(selected.value);
    };

    return (
        <>
            <SectionHeader title="Users" />
            {
                userItems.length > 0 &&
                <List items={ userItems } />
            }
            {
                userItems.length === 0 &&
                <Typography
                    className="no-items"
                    variant="body1"
                >
                    No Users
                </Typography>
            }
            <Button
                variant="contained"
                color="primary"
                onClick={ () => setState((draft) => {
                    draft.showUserDialog = true;
                }) }
                disabled={ availableUserOptions.length === 0 }
            >
                Add User
            </Button>
            <SelectDialog
                label="User"
                open={ state.showUserDialog }
                title="Add User"
                onSelect={ doSaveAddUser }
                onCancel={ () => setState((draft) => {
                    draft.showUserDialog = false;
                }) }
                options={ availableUserOptions }
            />
        </>
    );
}

export default ClientGrantUsers;
