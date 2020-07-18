import React, { ElementType, ComponentType, useEffect } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';

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

// TODO missing piece is recording isAuth = false for all 401s

const ProtectedRoute = <T extends object,R extends object>(props: Props<T,R>) => {
    const history = useHistory();
    useEffect(() => {
        const unlisten = history.listen((location, action) => {
            console.log(location, action); // TODO delete this
            console.log(props.ruleProps); // TODO delete this
            const failedRule = props.rules?.find((rule: Rule<R>) => !rule.allow(props.ruleProps));
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
