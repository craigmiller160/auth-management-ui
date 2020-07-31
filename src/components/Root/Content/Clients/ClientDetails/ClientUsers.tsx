import React from 'react';
import { ClientUser } from '../../../../../types/client';
import Grid from '@material-ui/core/Grid';
import { SectionHeader } from '../../../../ui/Header';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router';
import List, { Item } from '../../../../ui/List';
import { Button } from '@material-ui/core';

interface Props {
    users: Array<ClientUser>;
}

const ClientUsers = (props: Props) => {
    const {
        users
    } = props;
    const history = useHistory();
    const userClick = (id: number) => history.push(`/users/${id}`);

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

    const newUser = () => {
        // TODO implement this
    };

    return (
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
    );
};

export default ClientUsers;
