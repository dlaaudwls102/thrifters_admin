import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, withStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FinalizeOrderTable from '../../components/finalizeOrderTable';
import { auth } from '../../config/firebase';
import ErrorComponent from '../../components/errorComponent';
import IPageProps from '../../interfaces/page';
import Non_FinalizeOrderTable from '../../components/non_FinalizeOrderTable';
import { useHistory } from 'react-router-dom';

const Videhome_Finalize: React.FunctionComponent<IPageProps> = props => {
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
        history.push('/requests')
     }
     const goHome = () =>{
        history.push('/')
     }
     const goNext = () =>{
        history.push('/payment')
     }
     const history = useHistory();


    return (
        <div className="Apps fade">
            {!show === true ? (
                <>
                </>
            ) : (
                <div>
                    <div className="left" id="pot">
                        <FinalizeOrderTable />
                        <Non_FinalizeOrderTable />
                        <div className="wrapper"></div>
                    </div>
                    <div className="middles">
                        <div className="top"></div>
                    </div>
                </div>
            )}
            <div style={{width:"100%", position:"relative", display:"flex", justifyContent:"center", }}>
              <Button
                id="pot"
                variant="outlined"
                onClick={() => goBack()}
                style={{
                    width: '10%',
                    padding: '10px',
                
                    fontFamily: 'TmoneyRoundWindExtraBold',
                    fontSize: '15px',
                }}
            >
               {"<"}
            </Button>
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
            <Button
                id="pot"
                variant="outlined"
                onClick={() => goNext()}
                style={{
                    width: '10%',
                    padding: '10px',
                
                    fontFamily: 'TmoneyRoundWindExtraBold',
                    fontSize: '15px',
                }}
            >
               {">"}
            </Button>
            </div>
        </div>
    );
}

export default Videhome_Finalize;
