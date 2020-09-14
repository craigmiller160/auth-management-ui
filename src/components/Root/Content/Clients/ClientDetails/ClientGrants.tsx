import React, { MouseEvent, useEffect } from 'react';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { addUserToClient, getFullClientDetails, removeUserFromClient } from '../../../../../services/ClientService';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { ClientRole, ClientUser } from '../../../../../types/client';
import { Button, Grid, Typography } from '@material-ui/core';
import './ClientGrants.scss';
import { addRoleToUser, getAllUsers, removeRoleFromUser } from '../../../../../services/UserService';
import { UserDetails } from '../../../../../types/user';
import List, { Item } from '../../../../ui/List';
import PersonIcon from '@material-ui/icons/Person';
import { exists, fromNullable, getOrElse as oGetOrElse, map as oMap, none, Option, some } from 'fp-ts/es6/Option';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import { SelectDialog } from '../../../../ui/Dialog';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { useHistory } from 'react-router';
import { SectionHeader } from '../../../../ui/Header';

interface Props extends IdMatchProps {}

interface State {
    clientId: number;
    clientName: string;
    allRoles: Array<ClientRole>;
    clientUsers: Array<ClientUser>;
    allUsers: Array<UserDetails>;
    selectedUser: Option<ClientUser>;
    showRoleDialog: boolean;
    showUserDialog: boolean;
}

const ClientGrants = (props: Props) => {
    const id = props.match.params.id;
    const history = useHistory();

    const [state, setState] = useImmer<State>({
        clientId: id !== NEW_ID ? parseInt(id) : 0,
        clientName: '',
        allRoles: [],
        clientUsers: [],
        allUsers: [],
        selectedUser: none,
        showRoleDialog: false,
        showUserDialog: false
    });

    const loadFullClientDetails = async (): Promise<Array<ClientUser>> =>
        pipe(
            await getFullClientDetails(state.clientId),
            map( (fullClientDetails) => {
                setState((draft) => {
                    draft.clientName = fullClientDetails.name;
                    draft.allRoles = fullClientDetails.roles;
                    draft.clientUsers = fullClientDetails.users;
                });
                return fullClientDetails.users;
            }),
            getOrElse((): Array<ClientUser> => [])
        );

    const loadUsers = async (clientUsers: Array<ClientUser>) =>
        pipe(
            await getAllUsers(),
            map((list) => list.users),
            map((users) =>
                users.filter((user) => {
                    const index = clientUsers.findIndex((cUser) => cUser.id === user.id);
                    return index === -1;
                })
            ),
            map((users) =>
                setState((draft) => {
                    draft.allUsers = users;
                })
            )
        );

    const loadAll = async () => {
        const clientUsers = await loadFullClientDetails();
        await loadUsers(clientUsers);
    };

    const removeUser = async (userId: number) => {
        await removeUserFromClient(userId, state.clientId);
        await loadAll();
    };

    const userItems: Array<Item> = state.clientUsers
        .map((user) => ({
            avatar: () => <PersonIcon />,
            click: () => setState((draft) => {
                draft.selectedUser = some(user);
            }),
            active: exists((selected: ClientUser) => selected.id === user.id)(state.selectedUser),
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

    useEffect(() => {
        loadAll();
    }, []);

    const saveAddRole = (selected: SelectOption<number>) =>
        pipe(
            state.selectedUser,
            oMap(async (selectedUser) => {
                await addRoleToUser(selectedUser.id, state.clientId, selected.value);
                await loadAll();
                setState((draft) => {
                    draft.showRoleDialog = false;
                    pipe(
                        draft.selectedUser,
                        oMap((oldSelectedUser) => {
                            draft.selectedUser = fromNullable(draft.clientUsers.find((user) => user.id === oldSelectedUser.id));
                        })
                    );
                });
            })
        );

    const removeRole = (roleId: number) =>
        pipe(
            state.selectedUser,
            oMap(async (selectedUser) => {
                await removeRoleFromUser(selectedUser.id, state.clientId, roleId);
                await loadAll();
                setState((draft) => {
                    pipe(
                        draft.selectedUser,
                        oMap((oldSelectedUser) => {
                            draft.selectedUser = fromNullable(draft.clientUsers.find((user) => user.id === oldSelectedUser.id));
                        })
                    );
                });
            })
        );

    const availableUsers = state.allUsers
        .filter((user) => {
            const index = state.clientUsers.findIndex((cUser) => cUser.id === user.id);
            return index === -1;
        });

    const availableUserOptions: Array<SelectOption<number>> = availableUsers
        .map((user) => ({
            value: user.id,
            label: user.email
        }));

    const saveAddUser = async (selected: SelectOption<number>) => {
        await addUserToClient(selected.value, state.clientId);
        await loadAll();
        setState((draft) => {
            draft.showUserDialog = false;
        });
    };

    return (
        <div className="ClientGrants">
            <Typography
                className="name"
                variant="h5"
            >
                { state.clientName }
            </Typography>
            <Grid
                container
                direction="row"
                justify="space-around"
            >
                <Grid
                    direction="column"
                    container
                    item
                    md={ 5 }
                >
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
                        disabled={ availableUsers.length === 0 }
                    >
                        Add User
                    </Button>
                </Grid>
                <Grid item md={ 2 } />
                <Grid
                    direction="column"
                    container
                    item
                    md={ 5 }
                >
                    <SectionHeader title="Roles" />
                    {
                        pipe(
                            state.selectedUser,
                            oMap((selectedUser: ClientUser) => {
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

                                const availableRoles = state.allRoles
                                    .filter((role) => {
                                        const index = selectedUser.roles.findIndex((uRole) => uRole.id === role.id);
                                        return index === -1;
                                    });

                                const roleOptions: Array<SelectOption<number>> = availableRoles
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
                                            disabled={ availableRoles.length === 0 }
                                        >
                                            Add Role
                                        </Button>
                                        <SelectDialog
                                            label="Role"
                                            open={ state.showRoleDialog }
                                            title="Add Role"
                                            onSelect={ saveAddRole }
                                            onCancel={ () => setState((draft) => {
                                                draft.showRoleDialog = false;
                                            }) }
                                            options={ roleOptions }
                                        />
                                    </>
                                );
                            }),
                            oGetOrElse(() => <div />)
                        )
                    }
                </Grid>
            </Grid>
            <SelectDialog
                label="User"
                open={ state.showUserDialog }
                title="Add User"
                onSelect={ saveAddUser }
                onCancel={ () => setState((draft) => {
                    draft.showUserDialog = false;
                }) }
                options={ availableUserOptions }
            />
        </div>
    );
};

export default ClientGrants;
