import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';

import AuthRoute from './components/AuthRoute';
import { auth } from './config/firebase';
import logging from './config/logging';
import routes from './config/routes';

export interface IApplicationProps { }

const Application: React.FunctionComponent<IApplicationProps> = props => {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        auth.onAuthStateChanged((user:any) => {
            if (user)
            {
                logging.info('User detected.');
            }
            else
            {
                logging.info('No user detected');
            }

            setLoading(false);
        })
    }, []);


    return (
        <div>
            <BrowserRouter>
                <Switch>
                    {routes.map((route, index) => 
                        <Route
                            key={index}
                            path={route.path} 
                            exact={route.exact} 
                            render={(routeProps: RouteComponentProps<any>) => {
                                if (route.protected)
                                    return <AuthRoute><route.component  {...routeProps} /></AuthRoute>;

                                return <route.component  {...routeProps} />;
                            }}
                        />)}
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default Application;