import React from 'react';
import { SectionHeader } from '../../../../ui/Header';
import Grid from '@material-ui/core/Grid';
import { List } from '@material-ui/core';
import { FullUserClient } from '../../../../../types/api';
import ListItem from '@material-ui/core/ListItem';

interface Props {
    clients: Array<FullUserClient>;
}

const UserClientsRoles = (props: Props) => {
    const {
        clients
    } = props;

    return (
        <div>
            <Grid
                container
                direction="row"
            >
                <Grid item md={ 5 }>
                    <SectionHeader title="Clients" />
                    <List>
                        {
                            clients.map((fullClient, index) => (
                                <ListItem
                                    key={ index }
                                >
                                    ABC
                                </ListItem>
                            ))
                        }
                    </List>
                </Grid>
                <Grid item md={ 2 } />
                <Grid item md={ 5 }>
                    <SectionHeader title="Roles" />
                </Grid>
            </Grid>
        </div>
    );
};

export default UserClientsRoles;
