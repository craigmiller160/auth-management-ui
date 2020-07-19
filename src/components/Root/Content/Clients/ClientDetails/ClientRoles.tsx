import React from 'react';
import { Role } from '../../../../../types/api';
import { SectionHeader } from '../../../../ui/Header';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import theme from '../../../../theme';
import Button from '@material-ui/core/Button';
import RoleDialog from './RoleDialog';
import { useImmer } from 'use-immer';

interface Props {
    clientId: number;
    roles: Array<Role>;
}

interface State {
    showRoleDialog: boolean;
    selectedRole: Role;
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
        clientId,
        roles
    } = props;
    const classes = useStyles();
    const [state, setState] = useImmer<State>({
        showRoleDialog: false,
        selectedRole: {
            id: 0,
            name: '',
            clientId
        }
    });

    const selectRole = (role: Role) => {
        setState((draft) => {
            draft.selectedRole = role;
            draft.showRoleDialog = true;
        });
    };

    const closeRoleDialog = () =>
        setState((draft) => {
            draft.showRoleDialog = false;
        });

    return (
        <>
            <Grid
                item
                md={ 5 }
            >
                <SectionHeader title="Roles" />
                <List>
                    {
                        roles.map((role, index) => (
                            <ListItem
                                key={ index }
                                className={ classes.ListItem }
                                onClick={ () => selectRole(role) }
                            >
                                <ListItemAvatar>
                                    <AssignIcon />
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
            <RoleDialog
                role={ state.selectedRole }
                open={ state.showRoleDialog }
                onClose={ closeRoleDialog }
            />
        </>
    );
};

export default ClientRoles;
