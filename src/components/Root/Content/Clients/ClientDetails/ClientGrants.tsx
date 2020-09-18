import React, { useEffect } from 'react';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { addUserToClient, getFullClientDetails, removeUserFromClient } from '../../../../../services/ClientService';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { ClientRole, ClientUser } from '../../../../../types/client';
import { Grid, Typography } from '@material-ui/core';
import './ClientGrants.scss';
import { addRoleToUser, getAllUsers, removeRoleFromUser } from '../../../../../services/UserService';
import { UserDetails } from '../../../../../types/user';
import { fromNullable, getOrElse as oGetOrElse, map as oMap, none, Option, some } from 'fp-ts/es6/Option';
import { useHistory } from 'react-router';
import { SectionHeader } from '../../../../ui/Header';
import ClientGrantUsers from './ClientGrantUsers';
import ClientGrantRoles from './ClientGrantRoles';

interface Props extends IdMatchProps {}

interface State {
    clientId: number;
    clientName: string;
    allRoles: Array<ClientRole>;
    clientUsers: Array<ClientUser>;
    allUsers: Array<UserDetails>;
    selectedUser: Option<ClientUser>;
    showRoleDialog: boolean; // TODO delete this
    showUserDialog: boolean; // TODO delete this
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

    useEffect(() => {
        loadAll();
    }, []);

    const saveAddRole = (roleId: number) =>
        pipe(
            state.selectedUser,
            oMap(async (selectedUser) => {
                await addRoleToUser(selectedUser.id, state.clientId, roleId);
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

    const saveAddUser = async (userId: number) => {
        await addUserToClient(userId, state.clientId);
        await loadAll();
        setState((draft) => {
            draft.showUserDialog = false;
        });
    };

    const selectUser = (user: ClientUser) =>
        setState((draft) => {
            draft.selectedUser = some(user);
        });

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
                    <ClientGrantUsers
                        clientUsers={ state.clientUsers }
                        selectUser={ selectUser }
                        removeUser={ removeUser }
                        selectedUser={ state.selectedUser }
                        allUsers={ state.allUsers }
                        saveAddUser={ saveAddUser }
                    />
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
                            oMap((selectedUser: ClientUser) => (
                                <ClientGrantRoles
                                    selectedUser={ selectedUser }
                                    removeRole={ removeRole }
                                    saveAddRole={ saveAddRole }
                                    allRoles={ state.allRoles }
                                />
                            )),
                            oGetOrElse(() => <div />)
                        )
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default ClientGrants;
