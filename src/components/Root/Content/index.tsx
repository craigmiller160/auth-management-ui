import React from 'react';
import Container from '@material-ui/core/Container';
import { Route, Switch } from 'react-router';
import ProtectedRoute from '../../routing/ProtectedRoute';
import Clients from './Clients';
import { useSelector } from 'react-redux';
import { isAuthorized } from '../../../store/auth/selectors';
import Home from './Home';

const Content = () => {
    const isAuth = useSelector(isAuthorized);

    const isAuthRule = {
        allow: () => isAuth,
        redirect: '/'
    };

    return (
        <Container>
            <Switch>
                <ProtectedRoute
                    path="/clients"
                    component={ Clients }
                    rules={ [
                        isAuthRule
                    ] }
                />
                <Route
                    path="/"
                    exact
                    component={ Home }
                />
            </Switch>
        </Container>
    );
};

export default Content;
