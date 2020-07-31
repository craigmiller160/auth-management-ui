import React, { useEffect, useMemo } from 'react';
import { ClientUser } from '../../../../../types/client';
import Grid from '@material-ui/core/Grid';
import { SectionHeader } from '../../../../ui/Header';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router';
import List, { Item } from '../../../../ui/List';
import { Button } from '@material-ui/core';
import SelectDialog from '../../../../ui/Dialog/SelectDialog';
import { useImmer } from 'use-immer';
import { UserDetails, UserList } from '../../../../../types/user';
import { getAllUsers } from '../../../../../services/UserService';
import { pipe } from 'fp-ts/es6/pipeable';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { Option } from 'fp-ts/es6/Option';

interface Props {
    users: Array<ClientUser>;
}

interface State {
    allUsers: Array<UserDetails>;
    showAddUserDialog: boolean;
}

const ClientUsers = (props: Props) => {
    const {
        users
    } = props;
    const history = useHistory();
    const [state, setState] = useImmer<State>({
        allUsers: [],
        showAddUserDialog: false
    });
    const userClick = (id: number) => history.push(`/users/${id}`);

    useEffect(() => {
        const action = async () => {
            const allUsers = pipe(
                await getAllUsers(),
                map((list: UserList) => list.users),
                getOrElse((): Array<UserDetails> => [])
            );

            setState((draft) => {
                draft.allUsers = allUsers;
            });
        };

        action();
    }, [setState]);

    const removeUser = () => {
        // TODO finish this
    };

    const items: Array<Item> = users.map((user): Item => ({
        avatar: () => <PersonIcon />,
        text: {
            primary: `${user.firstName} ${user.lastName}`,
            secondary: user.roles.map((role) => role.name).join(', ')
        },
        secondaryActions: [
            {
                text: 'Go',
                click: () => userClick(user.id)
            },
            {
                text: 'Remove',
                click: () => {}
            }
        ]
    }));

    const newUser = () =>
        setState((draft) => {
            draft.showAddUserDialog = true;
        });

    const dialogOnCancel = () =>
        setState((draft) => {
            draft.showAddUserDialog = false;
        });

    const addUser = async (selectedUser: Option<SelectOption<number>>) => {
        console.log(selectedUser);
        // TODO execute the add user operation
        setState((draft) => {
            draft.showAddUserDialog = false
        });
    };

    const selectDialogUsers = useMemo(() =>
        state.allUsers
            .filter((user) => !props.users.find((otherUser) => user.id === otherUser.id))
            .sort((user1, user2) => {
                const name1 = `${user1.firstName} ${user1.lastName}`;
                const name2 = `${user2.firstName} ${user2.lastName}`;

                return name1.localeCompare(name2);
            })
            .map((user) => ({
                label: `${user.firstName} ${user.lastName}`,
                value: user.id
            })),
        [state.allUsers, props.users]);

    return (
        <>
            <Grid
                item
                md={ 5 }
            >
                <SectionHeader title="Users" />
                <List items={ items } />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ newUser }
                >
                    Add User
                </Button>
            </Grid>
            <SelectDialog
                open={ state.showAddUserDialog }
                title="Add User"
                onSelect={ addUser }
                onCancel={ dialogOnCancel }
                options={ selectDialogUsers }
            />
        </>
    );
};

export default ClientUsers;
