import React, { useState } from 'react';
import {Button, FormControlLabel, withStyles} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import OrderTable from './components/orderTable';
import CustomerTable from './components/customerTable';



function Videhome_CustomerList() {    


    return (
    <div className="Apps fade">
      <div className="left">
        <CustomerTable/>
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

export default Videhome_CustomerList;