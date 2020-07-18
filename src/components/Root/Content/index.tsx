import React from 'react';
import Container from '@material-ui/core/Container';
import { Route, Switch } from 'react-router';
import ProtectedRoute from '../../routing/ProtectedRoute';
import Clients from './Clients';
import { useSelector } from 'react-redux';
import { isAuthorized } from '../../../store/auth/selectors';
import Home from './Home';
import Users from './Users';
import ClientDetails from './Clients/ClientDetails';
import Alert from '../../ui/Alert';
import './Content.scss';

const Content = () => {
    const isAuth = useSelector(isAuthorized);

    const isAuthRule = {
        allow: () => isAuth,
        redirect: '/'
    };

    return (
        <Container className="Content">
            <Alert />
            <Switch>
                <ProtectedRoute
                    path="/clients"
                    exact
                    component={ Clients }
                    rules={ [
                        isAuthRule
                    ] }
                />
                <ProtectedRoute
                    path="/clients/:id"
                    component={ ClientDetails }
                    rules={ [
                        isAuthRule
                    ] }
                />
                <ProtectedRoute
                    path="/users"
                    component={ Users }
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
