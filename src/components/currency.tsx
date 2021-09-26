import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useHistory } from 'react-router-dom';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import listPlugin from '@fullcalendar/list';
import adaptivePlugin from '@fullcalendar/adaptive';

import "@fullcalendar/core/main.cjs";
import "@fullcalendar/daygrid/main.cjs";
import Calender from '@fullcalendar/core'
import { db } from '../config/firebase';
import { Button } from '@material-ui/core';



const Currency = () => {
    const [currencyList, setCurrencyList] = useState<any>([]);
    
    const goBack = () =>{
        history.push('/')
     }
     const history = useHistory();



    useEffect(()=>{
        // db.collection("showWork").doc("calendar").update({
        //     request: events
        // })
        db.collection("infos").doc("currency")
        .get().then((doc)=>{
           setCurrencyList(doc.data()!.calculate);
        })
    },[])
    return (
        <div style={{paddingTop:"50px", fontSize:"11px", color:"black", height:"100%", width:"100%"}}>
                    <div className="Apps">

<div className="loader-wrapper" style={{ position: 'fixed' }}>
    <span className="loader">
        <span className="loader-innder"></span>
    </span>
    <span className="loader_text">

        준비중 입니다.
    </span>
</div>

</div>

        </div>
    );
};
export default Currency;
