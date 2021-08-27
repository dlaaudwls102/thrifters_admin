import React, { useEffect, useState } from 'react';
import {Button, FormControlLabel, withStyles} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import OrderTable from './components/orderTable';
import { auth } from './config/firebase';
import ErrorComponent from './components/errorComponent';



function Videhome_Requests() {    
  const [show,setShow] = useState(true);  
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
      <div className="left">
        <OrderTable/>
        <div className="wrapper">
        </div> 
        </div>
        <div className="middles">
          <div className="top">
          </div>
        </div>
        </div>:<><ErrorComponent/></>}
    </div>
  );
}

export default Videhome_Requests;