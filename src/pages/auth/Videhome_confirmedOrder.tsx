import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import CheckedTable from '../../components/checkedTable';
import { auth } from '../../config/firebase';
import IPageProps from '../../interfaces/page';
import { useHistory } from 'react-router-dom';

const Videhome_ConfirmedOrder: React.FunctionComponent<IPageProps> = props => {
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
                        <CheckedTable />
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
            </div>
        </div>
    );
}

export default Videhome_ConfirmedOrder;
