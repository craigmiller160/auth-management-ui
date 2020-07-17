import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface Rule {
    allow: () => boolean;
    redirect: string;
}

interface Props {
    rules?: Array<Rule>;
    path: string;
    componentProps: object; // TODO make this generic
    component: any; // TODO need to type this better
    exact?: boolean;
    routeKey?: string;
}

const ProtectedRoute = (props: Props) => {
    const failedRule = props.rules?.find((rule: Rule) => !rule.allow());
    if (failedRule) {
        return <Redirect to={ failedRule.redirect } />
    }

    const Component = props.component;

    return (
        <Route
            path={ props.path }
            exact={ props.exact }
            key={ props.routeKey }
            render={ (routeProps) => (
                <Component
                    { ...routeProps }
                    { ...props.componentProps }
                />
            ) }
        />
    );
};

export default ProtectedRoute;
