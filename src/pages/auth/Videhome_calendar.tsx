import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import ErrorComponent from '../../components/errorComponent';
import IPageProps from '../../interfaces/page';
import Calendar from "../../components/calendar";

const Videhome_Calendar: React.FunctionComponent<IPageProps> = props => {
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

    return (
        <div className="Apps fade">
            {show === true ? (
                <div>
                    <div id="pot" style={{height:"1000px"}}>
                        <Calendar/>
                        <div className="wrapper"></div>
                    </div>
                    <div className="middles">
                        <div className="top"></div>
                    </div>
                </div>
            ) : (
                <>
                    <ErrorComponent />
                </>
            )}
        </div>
    );
}

export default Videhome_Calendar;
