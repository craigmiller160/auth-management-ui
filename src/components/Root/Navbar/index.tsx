import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthorized } from '../../../store/auth/selectors';
import { RootState } from '../../../store';
import { login, logout } from '../../../services/AuthService';
import authSlice from '../../../store/auth/slice';
import { none } from 'fp-ts/es6/Option';

const isActive = (pathname: string, path: string, exact: boolean = false): boolean =>
    exact ? pathname === path : pathname !== '/' && pathname.startsWith(path);

const Navbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const isAuth = useSelector(isAuthorized);
    const hasChecked = useSelector((state: RootState) => state.auth.hasChecked);
    const authBtnText = isAuth ? 'Logout' : 'Login';

    const doLogout = async () => {
        await logout();
        dispatch(authSlice.actions.setUserData(none));
    };
    const authAction = isAuth ? doLogout : login;

    const usersActive = isActive(location.pathname, '/users');
    const clientsActive = isActive(location.pathname, '/clients');

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
                                <NavLink to="/users" className="NavLink">
                                    <Button
                                        variant={ usersActive ? 'contained' : 'text' }
                                        color={ usersActive ? 'default' : 'inherit' }
                                    >
                                        Users
                                    </Button>
                                </NavLink>
                                <NavLink to="/clients" className="NavLink">
                                    <Button
                                        variant={ clientsActive ? 'contained' : 'text' }
                                        color={ clientsActive ? 'default' : 'inherit' }
                                    >
                                        Clients
                                    </Button>
                                </NavLink>
                            </>
                    }
                </div>
                <div>
                    {
                        hasChecked &&
                        <Button
                            variant="text"
                            color="inherit"
                            onClick={ authAction }
                        >
                            { authBtnText }
                        </Button>
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
