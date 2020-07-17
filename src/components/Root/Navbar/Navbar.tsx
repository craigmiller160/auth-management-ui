import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthorized } from '../../../store/auth/selectors';
import { RootState } from '../../../store';
import { logout } from '../../../services/AuthService';
import authSlice from '../../../store/auth/slice';
import { none } from 'fp-ts/es6/Option';

const Navbar = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(isAuthorized);
    const hasChecked = useSelector((state: RootState) => state.auth.hasChecked);
    const authBtnText = isAuth ? 'Logout' : 'Login';

    const doLogin = () => window.location.href = '/api/oauth/authcode/login';
    const doLogout = async () => {
        await logout();
        dispatch(authSlice.actions.setUserData(none));
    };
    const authAction = isAuth ? doLogout : doLogin;

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
