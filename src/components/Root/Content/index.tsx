import React from 'react';
import PageHeader from '../../ui/PageHeader/PageHeader';
import Container from '@material-ui/core/Container';
import { Switch } from 'react-router';
import ProtectedRoute from '../../routing/ProtectedRoute';
import Clients from './Clients';

const Content = () => (
    <Container>
        <PageHeader title="Welcome to OAuth Management" />
        <Switch>
            <ProtectedRoute
                path="/clients"
                component={ Clients }
            />
        </Switch>
    </Container>
);

export default Content;
