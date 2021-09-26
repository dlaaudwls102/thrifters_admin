import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, withStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import OrderTable from '../../components/orderTable';
import CheckedTable from '../../components/checkedTable';
import { auth } from '../../config/firebase';
import ErrorComponent from '../../components/errorComponent';
import IPageProps from '../../interfaces/page';
import { useHistory } from 'react-router-dom';
import Currency from "../../components/currency"

const Videhome_Process_Info: React.FunctionComponent<IPageProps> = props => {
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

    const goBack = () =>{
        history.push('/payment')
     }
     const goHome = () =>{
        history.push('/')
     }
     const history = useHistory();

    return (
        <div className="Apps fade">
            {show === true ? (
                <div>
                    <div className="left" id="pot">
                        {/* <Process_Info /> */}
                        <div className="loader-wrapper" style={{ position: 'fixed' }}>
    <span className="loader">
        <span className="loader-innder"></span>
    </span>
    <span className="loader_text">

        준비중 입니다.
    </span>
</div>
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
            <div style={{width:"100%", position:"relative", display:"flex", justifyContent:"center", }}>
                        <Button
                id="pot"
                variant="outlined"
                onClick={() => goHome()}
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
        </div>
    );
}

export default Videhome_Process_Info;
