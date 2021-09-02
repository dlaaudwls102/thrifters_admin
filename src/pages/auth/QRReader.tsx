import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';
import ErrorText from '../../components/ErrorText';
import { auth, db, Providers } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';
import firebase from 'firebase';
import { SignInWithSocialMedia } from './modules';
import { FormControl, InputAdornment, TextField, Button } from '@material-ui/core';
import { useEffect } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const QRReaderPage: React.FunctionComponent<IPageProps> = props => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [result, setResult]= useState<string>('');
    const [data, setData] = React.useState<any>("Not Found");
    
    const [editON,setEditON] = useState<boolean>(false);
    const delay = (ms:any) => new Promise((res:any) => setTimeout(res, ms));

    const startEdit = () =>{
        setEditON(!editON);
    }
    const goBack = () =>{
       history.push('/')
    }
    const history = useHistory();
    const goTo = (uid:string) =>{
        history.push('/customer_info',uid);
    }

    return (
        <div>
            <div className="img-logo-loginss">
                <div id="diode">
                    <div id="laser"></div>
                    </div>
                </div>
                <img className="img-logo-logins" src="./videhome_logo.png"></img>
            <div style={{border:"solid 7px #FBAA13",padding:0}}>
            <BarcodeScannerComponent
                facingMode={"environment"}
                width={500}
                height={400}
                onUpdate={(err, result) => {
                if (result) setData(result.getText());
                else setData("Not Found");
                }}
            />
            </div>
            {(data == "Not Foundd")?<></>
            : history.push('/customer_info',data)}
            <div id='pot' style={{border:"solid 7px #07381B", padding:"10px",color:"black", fontFamily: 'TmoneyRoundWindExtraBold'}}><p>{data}</p></div>
            <Button id='pot'
            disabled={editON}
                variant="outlined"
                onClick={() => goBack()}
                style={{width:"40%",padding:"10px",margin:"40px",fontFamily: 'TmoneyRoundWindExtraBold', fontSize:"15px"}}
            >
                뒤로가기
            </Button>
            
        </div>
    );
}

export default QRReaderPage;

// MIT License

// Copyright (c) 2021 Dashboard Philippines

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.