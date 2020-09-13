import React, { useEffect } from 'react';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getFullClientDetails } from '../../../../../services/ClientService';
import { Either, flatten, getOrElse, map } from 'fp-ts/es6/Either';
import { ClientRole, ClientUser, FullClientDetails } from '../../../../../types/client';
import { Grid, Typography } from '@material-ui/core';
import './ClientGrants.scss';
import { getAllUsers } from '../../../../../services/UserService';
import { UserDetails, UserList } from '../../../../../types/user';
import List, { Item } from '../../../../ui/List';
import PersonIcon from '@material-ui/icons/Person';

interface Props extends IdMatchProps {}

interface State {
    clientId: number;
    clientName: string;
    allRoles: Array<ClientRole>;
    clientUsers: Array<ClientUser>;
    allUsers: Array<UserDetails>;
}


const ClientGrants = (props: Props) => {
    const id = props.match.params.id;

    const [state, setState] = useImmer<State>({
        clientId: id !== NEW_ID ? parseInt(id) : 0,
        clientName: '',
        allRoles: [],
        clientUsers: [],
        allUsers: []
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
                    <List items={ userItems } />
                </Grid>
                <Grid item md={ 2 } />
                <Grid
                    direction="column"
                    container
                    item
                    md={ 5 }
                >

                </Grid>
            </Grid>
        </div>
    );
};

export default ClientGrants;
