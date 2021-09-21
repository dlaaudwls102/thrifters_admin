import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, withStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FinalizeOrderTable from '../../components/finalizeOrderTable';
import { auth } from '../../config/firebase';
import ErrorComponent from '../../components/errorComponent';
import IPageProps from '../../interfaces/page';
import Non_FinalizeOrderTable from '../../components/non_FinalizeOrderTable';
import PaymentConfirmationTable from '../../components/paymentConfirmationTable';
import Non_PaymentConfirmationTable from '../../components/non_paymentConfirmationTable';

const Videhome_Payment: React.FunctionComponent<IPageProps> = props => {
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
            {!show === true ? (
                <>
                    <ErrorComponent />
                </>
            ) : (
                <div>
                    <div className="left" id="pot">
                        <PaymentConfirmationTable />
                        <Non_PaymentConfirmationTable />
                        <div className="wrapper"></div>
                    </div>
                    <div className="middles">
                        <div className="top"></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Videhome_Payment;
