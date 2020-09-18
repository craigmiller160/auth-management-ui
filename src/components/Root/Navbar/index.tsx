/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
import useTheme from '@material-ui/core/styles/useTheme';
import { useMediaQuery } from '@material-ui/core';
import { useImmer } from 'use-immer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MobileMenu from './MobileMenu';

interface State {
    menuOpen: boolean;
}

const isActive = (pathname: string, path: string, exact: boolean = false): boolean =>
    exact ? pathname === path : pathname !== '/' && pathname.startsWith(path);

const Navbar = () => {
    const theme = useTheme();
    const isNotPhone = useMediaQuery(theme.breakpoints.up('md'));
    const dispatch = useDispatch();
    const location = useLocation();
    const isAuth = useSelector(isAuthorized);
    const hasChecked = useSelector((state: RootState) => state.auth.hasChecked);
    const [state, setState] = useImmer<State>({
        menuOpen: false
    });

    const handleMenuOpen = () =>
        setState((draft) => {
            draft.menuOpen = true;
        });

    const handleMenuClose = () =>
        setState((draft) => {
            draft.menuOpen = false;
        });

    const authBtnText = isAuth ? 'Logout' : 'Login';

    const doLogout = async () => {
        await logout();
        dispatch(authSlice.actions.setUserData(none));
    };
    const authAction = isAuth ? doLogout : login;

    const usersActive = isActive(location.pathname, '/users');
    const clientsActive = isActive(location.pathname, '/clients');

    return (
        <>
            <AppBar position="static" className="Navbar">
                <Toolbar>
                    {
                        !isNotPhone &&
                        <IconButton edge="start" color="inherit" onClick={ handleMenuOpen }>
                            <MenuIcon />
                        </IconButton>
                    }
                    <Button variant="text" color="inherit">
                        <NavLink to="/" exact className="NavLink">
                            <Typography variant="h6" noWrap>OAuth Management</Typography>
                        </NavLink>
                    </Button>
                    {
                        isNotPhone &&
                        <>
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
                        </>
                    }
                </Toolbar>
            </AppBar>
            <MobileMenu
                isAuth={ isAuth }
                authBtnText={ authBtnText }
                authAction={ authAction }
                menuOpen={ state.menuOpen }
                handleMenuClose={ handleMenuClose }
            />
        </>
    );
};

export default Navbar;
