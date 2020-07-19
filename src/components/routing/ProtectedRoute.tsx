import React, { ComponentType, ElementType } from 'react';
import { Redirect, Route } from 'react-router-dom';

export interface Rule<R extends object> {
    allow: (ruleProps?: R) => boolean;
    redirect: string;
}

interface Props<T extends object,R extends object> {
    rules?: Array<Rule<R>>;
    path: string;
    componentProps?: T;
    ruleProps?: R;
    component: ElementType | ComponentType;
    exact?: boolean;
    routeKey?: string;
}

const ProtectedRoute = <T extends object,R extends object>(props: Props<T,R>) => {
    const failedRule = props.rules?.find((rule: Rule<R>) => !rule.allow(props.ruleProps));
    if (failedRule) {
        return <Redirect to={ failedRule.redirect } />;
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
                    { ...(props.componentProps ?? {}) }
                />
            ) }
        />
    );
};

export default ProtectedRoute;
