import React, { useEffect, useState } from 'react';
import {Button, FormControlLabel, withStyles} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import OrderTable from './components/orderTable';
import { auth } from './config/firebase';
import ErrorComponent from './components/errorComponent';
import Non_OrderTable from './components/non_orderTable';



function Videhome_Requests() {    
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
      {(!show === true)? <><ErrorComponent/></>
      :  <div>
      <div className="left">
        <OrderTable/>
        <Non_OrderTable/>
        <div className="wrapper">
        </div> 
        </div>
        <div className="middles">
          <div className="top">
          </div>
        </div>
        </div>}
    </div>
  );
}

export default Videhome_Requests;