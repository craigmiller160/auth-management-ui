import React from 'react';
import { Drawer } from '@material-ui/core';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import './MobileMenu.scss';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

interface Props {
    menuOpen: boolean;
    handleMenuClose: () => void;
    authAction: () => void;
    authBtnText: string;
    isAuth: boolean;
}

const useStyles = makeStyles({
    MenuPrimary: {
        backgroundColor: theme.palette.primary.main
    }
});

const MobileMenu = (props: Props) => {
    const classes = useStyles();
    const location = useLocation();

    const getItemClasses = (route: string) => {
        const isMatch: boolean = !!matchPath(location.pathname, {
            path: route,
            exact: false
        });

        const activeClass = isMatch ? ' active' : '';
        return `item ${activeClass}`;
    }

    const authButtonClick = () => {
        props.handleMenuClose();
        props.authAction();
    };

    return (
        <Drawer
            classes={ {
                paper: classes.MenuPrimary
            } }
            className="MobileMenu"
            open={ props.menuOpen }
            onClose={ props.handleMenuClose }
        >
            <NavLink
                to="/"
                exact
                className="NavLink"
            >
                <Typography
                    className="title"
                    variant="h6"
                    noWrap
                    onClick={ props.handleMenuClose }
                >
                    OAuth Management
                </Typography>
            </NavLink>
            {
                props.isAuth &&
                    <>
                        <ListItem
                            className={ getItemClasses('/users') }
                            onClick={ props.handleMenuClose }
                        >
                            <NavLink
                                to="/users"
                                className="NavLink"
                            >
                                <ListItemText>Users</ListItemText>
                            </NavLink>
                        </ListItem>
                        <ListItem
                            className={ getItemClasses('/clients') }
                            onClick={ props.handleMenuClose }
                        >
                            <NavLink
                                to="/clients"
                                className="NavLink"
                            >
                                <ListItemText>Clients</ListItemText>
                            </NavLink>
                        </ListItem>
                    </>
            }
            <ListItem
                className="item"
                onClick={ authButtonClick }
            >
                <ListItemText className="NavLink">{ props.authBtnText }</ListItemText>
            </ListItem>
        </Drawer>
    );
};

export default MobileMenu;
