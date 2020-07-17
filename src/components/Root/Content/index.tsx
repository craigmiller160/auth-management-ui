import React from 'react';
import PageHeader from '../../ui/PageHeader/PageHeader';
import Container from '@material-ui/core/Container';
import { Switch } from 'react-router';
import ProtectedRoute from '../../routing/ProtectedRoute';
import Clients from './Clients';

const props = {
    abc: 'def',
    ghi: 'jkl'
};

const Content = () => (
    <Container>
        <PageHeader title="Welcome to OAuth Management" />
        <Switch>
            <ProtectedRoute
                path="/clients"
                componentProps={ props }
                component={ Clients }
            />
        </Switch>
    </Container>
);

export default Content;
