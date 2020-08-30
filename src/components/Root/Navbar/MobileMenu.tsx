import React from 'react';
import { Drawer } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import './MobileMenu.scss';

interface Props {
    menuOpen: boolean;
    handleMenuClose: () => void;
}

const MobileMenu = (props: Props) => {
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
        </Drawer>
    );
};

export default MobileMenu;
