import React, { useEffect, useState } from 'react';
import RequestOnSite from '../../components/requestOnSite';
import { auth } from '../../config/firebase';
import IPageProps from '../../interfaces/page';
import { useHistory } from 'react-router-dom';

const Videhome_RequestOnSite: React.FunctionComponent<IPageProps> = (props) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged((user: any) => {
            if (user) {
                setShow(true);
            } else {
                setShow(false);
            }
        });
    }, []);

    const goBack = () => {
        history.push('/payment');
    };
    const goHome = () => {
        history.push('/');
    };
    const history = useHistory();

    return (
        <div className="Apps fade">
            {show === true ? (
                <div>
                    <div className="left" id="pot">
                        <img
                            style={{ margin: '50px 0 10px 0' }}
                            id="pot"
                            className="img-announce"
                            src="../apply.png"
                        ></img>
                        <RequestOnSite />
                        <div className="wrapper"></div>
                    </div>
                    <div className="middles">
                        <div className="top"></div>
                    </div>
                </div>
            ) : (
                <>로그인 해주세요</>
            )}
        </div>
    );
};

export default Videhome_RequestOnSite;
