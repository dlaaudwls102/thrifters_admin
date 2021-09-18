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



const Calendars = () => {
    const calendarComponentRef = React.createRef();
    const [events,setEvents] = useState(
        // [
        //     { id: '1', resourceId: 'b', start: '2018-02-07T02:00:00', end: '2018-02-07T07:00:00', title: 'event 1' },
        //     { id: '2', resourceId: 'c', start: '2018-02-07T05:00:00', end: '2018-02-07T22:00:00', title: 'event 2' },
        //     { id: '3', resourceId: 'd', start: '2018-02-06', end: '2018-02-08', title: 'event 3' },
        //     { id: '4', resourceId: 'e', start: '2018-02-07T03:00:00', end: '2018-02-07T08:00:00', title: 'event 4' },
        //     { id: '5', resourceId: 'a', start: '2021-09-20', end: '2021-09-20', title: '매입' }
        // ]
        []
    );
    const goBack = () =>{
        history.push('/')
     }
     const history = useHistory();

    const handleSelectedDates = (info: any) => {
        alert('selected ' + info.startStr + ' to ' + info.endStr);
        const title = prompt("What's the name of the title");
        console.log(info);
        if (title != null) {
            const newEvent = {
                title,
                start: info.startStr,
                end: info.endStr,
            };
            const data = [...events, newEvent];
            // setEvents( data );
            console.log("here", data);
            } else {
            console.log("nothing");
    }
        
    };

    useEffect(()=>{
        // db.collection("showWork").doc("calendar").update({
        //     request: events
        // })
        db.collection("showWork").doc("calendar")
        .get().then((doc)=>{
           setEvents(doc.data()!.request);
        })
    },[])
    return (
        <div style={{paddingTop:"50px", fontSize:"11px", color:"black", height:"100%", width:"100%"}}>

            <FullCalendar
                aspectRatio= {1.8}
                editable= {true}
                navLinks= {true}
                dayMaxEvents= {true}
                schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
                displayEventTime={true}
                selectable={true}
                plugins={[
                    dayGridPlugin,
                    interactionPlugin,
                    timeGridPlugin,
                    resourceTimeGridPlugin,
                    adaptivePlugin,
                    listPlugin,
                ]}
                eventClick={(event) => {
                    console.log(event.event._def.publicId);
                }}
                select={handleSelectedDates}
                events={events}
            />
                        <Button id='pot'
                variant="outlined"
                onClick={() => goBack()}
                style={{width:"40%",padding:"10px",margin:"40px",fontFamily: 'TmoneyRoundWindExtraBold', fontSize:"15px"}}
            >
                뒤로가기
            </Button>
        </div>
    );
};
export default Calendars;
