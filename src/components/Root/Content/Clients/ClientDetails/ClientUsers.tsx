import React from 'react';
import { User } from '../../../../../types/api';
import Grid from '@material-ui/core/Grid';
import { SectionHeader } from '../../../../ui/Header';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PersonIcon from '@material-ui/icons/Person';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import makeStyles from '@material-ui/core/styles/makeStyles';
import theme from '../../../../theme';

interface Props {
    users: Array<User>;
}

const useStyles = makeStyles({
    ListItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.light
        }
    }
})

const ClientUsers = (props: Props) => {
    const {
        users
    } = props;
    const classes = useStyles();

    return (
        <Grid
            item
            md={ 5 }
        >
            <SectionHeader title="Users" />
            <List>
                {
                    users.map((user, index) => (
                        <ListItem key={ index } className={ classes.ListItem }>
                            <ListItemAvatar>
                                <PersonIcon />
                            </ListItemAvatar>
                            <ListItemText
                                primary={ user.email }
                                secondary={ `${user.firstName} ${user.lastName}` }
                            />
                        </ListItem>
                    ))
                }
            </List>
        </Grid>
    );
};

export default ClientUsers;
