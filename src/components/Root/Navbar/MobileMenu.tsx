import React from 'react';
import { Drawer } from '@material-ui/core';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import './MobileMenu.scss';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

interface Props {
    menuOpen: boolean;
    handleMenuClose: () => void;
    authAction: () => void;
    authBtnText: string;
    isAuth: boolean;
}

const MobileMenu = (props: Props) => {
    const location = useLocation();
    console.log(location); // TODO delete this

    const authButtonClick = () => {
        props.handleMenuClose();
        props.authAction();
    };

    return (
        <Drawer
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
                            className="item"
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
                            className="item"
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
