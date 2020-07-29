import React from 'react';
import { ClientUser } from '../../../../../types/api';
import Grid from '@material-ui/core/Grid';
import { SectionHeader } from '../../../../ui/Header';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router';
import List, { Item } from '../../../../ui/List';

interface Props {
    users: Array<ClientUser>;
}

const ClientUsers = (props: Props) => {
    const {
        users
    } = props;
    const history = useHistory();
    const userClick = (id: number) => history.push(`/users/${id}`);

    const items: Array<Item> = users.map((user) => ({
        click: () => userClick(user.id),
        avatar: () => <PersonIcon />,
        text: {
            primary: user.email,
            secondary: `${user.firstName} ${user.lastName}`
        }
    }));

    return (
        <Grid
            item
            md={ 5 }
        >
            <SectionHeader title="Users" />
            <List items={ items } />
        </Grid>
    );
};

export default ClientUsers;
