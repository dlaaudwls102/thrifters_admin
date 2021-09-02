import React, { useEffect, useState } from 'react';
import {Button, FormControlLabel, withStyles} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import OrderTable from './components/orderTable';
import CheckedTable from './components/checkedTable';
import { auth } from './config/firebase';
import ErrorComponent from './components/errorComponent';



function Videhome_ConfirmedOrder() {  
    const [show,setShow] = useState(false);  
    useEffect(() => {
        auth.onAuthStateChanged((user:any) => {
            if (user)
            {
                setShow(true);
            }
            else
            {
                setShow(false);
            }
        })
    }, []);

    return (
    <div className="Apps fade">
        {(show === true)? 
        <div>
            <div className="left" id='pot'>
                <CheckedTable/>
                <div className="wrapper">
                </div> 
            </div>
            <div className="middles">
                <div className="top">
                </div>
            </div>
        </div>
        :<><ErrorComponent/></>}
    </div>
  );
}

export default Videhome_ConfirmedOrder;