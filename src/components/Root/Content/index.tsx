import React from 'react';
import PageHeader from '../../ui/PageHeader/PageHeader';
import Container from '@material-ui/core/Container';
import { Switch } from 'react-router';
import ProtectedRoute, { Rule } from '../../routing/ProtectedRoute';
import Clients from './Clients';
import { useSelector } from 'react-redux';
import { isAuthorized } from '../../../store/auth/selectors';

const Content = () => {
    const isAuth = useSelector(isAuthorized);

    const isAuthRule = {
        allow: () => isAuth,
        redirect: '/'
    };

    return (
        <Container>
            <PageHeader title="Welcome to OAuth Management" />
            <Switch>
                <ProtectedRoute
                    path="/clients"
                    component={ Clients }
                    rules={ [
                        isAuthRule
                    ] }
                />
            </Switch>
        </Container>
    );
};

export default Content;
