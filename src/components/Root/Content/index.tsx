import React from 'react';
import Container from '@material-ui/core/Container';
import { Redirect, Route, Switch } from 'react-router';
import ProtectedRoute, { Rule } from '@craigmiller160/react-protected-route';
import Clients from './Clients';
import { useSelector } from 'react-redux';
import { isAuthorized } from '../../../store/auth/selectors';
import Home from './Home';
import Users from './Users';
import ClientDetails from './Clients/OldClientDetails';
import Alert from '../../ui/Alert';
import './Content.scss';
import UserDetails from './Users/UserDetails';

interface RuleProps {
    isAuth: boolean;
}

const Content = () => {
    const isAuth = useSelector(isAuthorized);

    const isAuthRule: Rule<RuleProps> = {
        allow: (ruleProps?: RuleProps) => ruleProps?.isAuth ?? false,
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
                    ruleProps={ {
                        isAuth
                    } }
                    rules={ [
                        isAuthRule
                    ] }
                />
                <ProtectedRoute
                    path="/clients/:id"
                    component={ ClientDetails }
                    ruleProps={ {
                        isAuth
                    } }
                    rules={ [
                        isAuthRule
                    ] }
                />
                <ProtectedRoute
                    path="/users"
                    component={ Users }
                    exact
                    ruleProps={ {
                        isAuth
                    } }
                    rules={ [
                        isAuthRule
                    ] }
                />
                <ProtectedRoute
                    path="/users/:id"
                    component={ UserDetails }
                    ruleProps={ {
                        isAuth
                    } }
                    rules={ [
                        isAuthRule
                    ] }
                />
                <Route
                    path="/"
                    exact
                    component={ Home }
                />
                <Redirect to="/" />
            </Switch>
        </Container>
    );
};

export default Content;
