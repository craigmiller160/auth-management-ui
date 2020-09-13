import React, { useEffect } from 'react';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getFullClientDetails } from '../../../../../services/ClientService';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { ClientRole, ClientUser } from '../../../../../types/client';
import { Button, Grid, Typography } from '@material-ui/core';
import './ClientGrants.scss';
import { addRoleToUser, getAllUsers } from '../../../../../services/UserService';
import { UserDetails } from '../../../../../types/user';
import List, { Item } from '../../../../ui/List';
import PersonIcon from '@material-ui/icons/Person';
import { exists, fromNullable, getOrElse as oGetOrElse, map as oMap, none, Option, some } from 'fp-ts/es6/Option';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import { SelectDialog } from '../../../../ui/Dialog';
import { SelectOption } from '../../../../ui/Form/Autocomplete';

interface Props extends IdMatchProps {}

interface State {
    clientId: number;
    clientName: string;
    allRoles: Array<ClientRole>;
    clientUsers: Array<ClientUser>;
    allUsers: Array<UserDetails>;
    selectedUser: Option<ClientUser>;
    showRoleDialog: boolean;
}


const ClientGrants = (props: Props) => {
    const id = props.match.params.id;

    const [state, setState] = useImmer<State>({
        clientId: id !== NEW_ID ? parseInt(id) : 0,
        clientName: '',
        allRoles: [],
        clientUsers: [],
        allUsers: [],
        selectedUser: none,
        showRoleDialog: false
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
                    click: () => {}
                },
                {
                    text: 'Remove',
                    click: () => {}
                }
            ]
        }))

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
                    <Typography
                        className="name"
                        variant="body1"
                    >
                        Users
                    </Typography>
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
                        onClick={ () => {} }
                        disabled={ state.allUsers.length === 0 }
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
                    <Typography
                        className="name"
                        variant="body1"
                    >
                        Roles
                    </Typography>
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
                                                click: () => {}
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
        </div>
    );
};

export default ClientGrants;
