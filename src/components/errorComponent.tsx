import React from 'react';
import {Button} from '@material-ui/core';


function ErrorComponent() {
  return (
    <div className="Apps fade">
         {/* <img className="background" src="./videhome_logo.png"></img> */}
         <div style={{padding:"45px"}}>
         <img className="img-logo-login" src="./thrifter_logo.png"></img>
         </div>
        <div> 로그인 부터 해주세요.</div>
    </div>
  );
}
export default ErrorComponent;