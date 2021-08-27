import React, { useState } from 'react';
import {Button, FormControlLabel, withStyles} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import OrderTable from './components/orderTable';



function Videhome_Requests() {    


    return (
    <div className="Apps fade">
      <div className="left">
        <OrderTable/>
        <div className="wrapper">
        </div> 
        </div>
        <div className="middles">
          <div className="top">
          </div>
        </div>
    </div>
  );
}

export default Videhome_Requests;