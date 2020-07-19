import React from 'react';
import { Role } from '../../../../../types/api';
import { SectionHeader } from '../../../../ui/Header';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PersonIcon from '@material-ui/icons/Person';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import theme from '../../../../theme';
import Button from '@material-ui/core/Button';

interface Props {
    roles: Array<Role>;
}

const useStyles = makeStyles({
    ListItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.light
        }
    }
});

const ClientRoles = (props: Props) => {
    const {
        roles
    } = props;
    const classes = useStyles();

    return (
        <Grid
            item
            md={ 5 }
        >
            <SectionHeader title="Roles" />
            <List>
                {
                    roles.map((role, index) => (
                        <ListItem key={ index } className={ classes.ListItem }>
                            <ListItemAvatar>
                                <PersonIcon />
                            </ListItemAvatar>
                            <ListItemText
                                primary={ role.name }
                            />
                        </ListItem>
                    ))
                }
            </List>
            <Button variant="contained" color="primary">Add Role</Button>
        </Grid>
    );
};

export default ClientRoles;
