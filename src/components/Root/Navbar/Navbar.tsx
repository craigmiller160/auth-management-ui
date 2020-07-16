import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import { useSelector } from 'react-redux';
import { isAuthorized } from '../../../store/auth/selectors';

const Navbar = () => {
    const isAuth = useSelector(isAuthorized);
    const authBtnText = isAuth ? 'Logout' : 'Login';

    return (
        <AppBar position="static" className="Navbar">
            <Toolbar>
                <Button variant="text" color="inherit">
                    <NavLink to="/" exact className="NavLink">
                        <Typography variant="h6" noWrap>OAuth Management</Typography>
                    </NavLink>
                </Button>
                <div className="left">
                    {
                        isAuth &&
                            <>
                                <Button
                                    variant="text"
                                    color="inherit"
                                >
                                    <NavLink to="/users" className="NavLink">Users</NavLink>
                                </Button>
                                <Button
                                    variant="text"
                                    color="inherit"
                                >
                                    <NavLink to="/clients" className="NavLink">Clients</NavLink>
                                </Button>
                            </>
                    }
                </div>
                <div>
                    <Button
                        variant="text"
                        color="inherit"
                    >
                        { authBtnText }
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
