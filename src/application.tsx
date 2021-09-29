import React, { useEffect } from 'react';
import {
    BrowserRouter,
    Route,
    RouteComponentProps,
    Switch,
} from 'react-router-dom';

import AuthRoute from './components/AuthRoute';
import TopNav from './components/topnav';
import { auth } from './config/firebase';
import logging from './config/logging';
import routes from './config/routes';

export interface IApplicationProps {}

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
    useEffect(() => {
        auth.onAuthStateChanged((user: any) => {
            if (user) {
                logging.info('User detected.');
            } else {
                logging.info('No user detected');
            }
        });
    }, []);

    return (
        <div className="logins fade" style={{ width: '100%' }}>
            <BrowserRouter>
                <TopNav />
                <Switch>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            render={(routeProps: RouteComponentProps<any>) => {
                                if (route.protected)
                                    return (
                                        <AuthRoute>
                                            <route.component {...routeProps} />
                                        </AuthRoute>
                                    );

                                return <route.component {...routeProps} />;
                            }}
                        />
                    ))}
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default Application;
