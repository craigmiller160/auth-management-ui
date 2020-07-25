import React from 'react';
import { SectionHeader } from '../../../../ui/Header';
import Grid from '@material-ui/core/Grid';

interface Props {
    clients: object;
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
