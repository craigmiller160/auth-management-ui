import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
    return (
        <AppBar position="static" className="Navbar">
            <Toolbar>
                <Button variant="text" color="inherit">
                    <NavLink to="/" exact className="NavLink">
                        <Typography variant="h6" noWrap>OAuth Management</Typography>
                    </NavLink>
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
