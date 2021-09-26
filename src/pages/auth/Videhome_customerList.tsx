import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, withStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import OrderTable from '../../components/orderTable';
import CustomerTable from '../../components/customerTable';
import { auth } from '../../config/firebase';
import ErrorComponent from '../../components/errorComponent';
import IPageProps from '../../interfaces/page';
import { useHistory } from 'react-router-dom';

const Videhome_CustomerList: React.FunctionComponent<IPageProps> = props => {
    const [show, setShow] = useState(false);
    const goBack = () =>{
        history.push('/')
     }
     const goHome = () =>{
        history.push('/')
     }
     const goNext = () =>{
        history.push('/finalize')
     }
     const history = useHistory();
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
                    <div className="left" id="pot">
                        <CustomerTable />
                        <div className="wrapper"></div>
                    </div>
                    <div className="middles">
                        <div className="top"></div>
                    </div>
                </div>
            ) : (
                <>
                </>
            )}
                                    <Button
                id="pot"
                variant="outlined"
                onClick={() => goBack()}
                style={{
                    width: '40%',
                    padding: '10px',
                    margin: '0 40px',
                    fontFamily: 'TmoneyRoundWindExtraBold',
                    fontSize: '15px',
                }}
            >
                뒤로가기
            </Button>
        </div>
    );
}

export default Videhome_CustomerList;
