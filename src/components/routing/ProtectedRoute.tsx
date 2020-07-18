import React, { ElementType, ComponentType, useEffect } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';

export interface Rule {
    allow: () => boolean;
    redirect: string;
}

interface Props<T extends object> {
    rules?: Array<Rule>;
    path: string;
    componentProps?: T;
    component: ElementType | ComponentType;
    exact?: boolean;
    routeKey?: string;
}

const ProtectedRoute = <T extends object>(props: Props<T>) => {
    const history = useHistory();
    // TODO the protected routes don't work... the allow() methods capture the old value of isAuth
    useEffect(() => {
        const unlisten = history.listen((location, action) => {
            console.log(location, action); // TODO delete this
            const failedRule = props.rules?.find((rule: Rule) => !rule.allow());
            if (failedRule) {
                console.log('Failed rule'); // TODO delete this
                // return <Redirect to={ failedRule.redirect } />;
            }
        });
        return () => {
            unlisten();
        };
    }, []);

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
