import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';
import ErrorText from '../../components/ErrorText';
import { auth, Providers } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';
import firebase from 'firebase';
import { SignInWithSocialMedia } from './modules';
import { FormControl, InputAdornment, TextField, Button } from '@material-ui/core';
import { useEffect } from 'react';

const LoginPage: React.FunctionComponent<IPageProps> = props => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    
    const history = useHistory();


    const signInWithEmailAndPassword = () => {
        if (error !== '') setError('');

        setAuthenticating(true);

        auth.signInWithEmailAndPassword(email, password)
        .then(result => {
            logging.info(result);
            history.push('/');
        })
        .catch(error => {
            logging.error(error);
            setAuthenticating(false);
            setError(error.message);
        });
    }

    const signInWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
        if (error !== '') setError('');

        setAuthenticating(true);

        SignInWithSocialMedia(provider)
        .then(result => {
            logging.info(result);
            history.push('/');
        })
        .catch(error => {
            logging.error(error);
            setAuthenticating(false);
            setError(error.message);
        });
    }

    return (
        <div>
              <img className="img-logo-login" src="./videhome_logo.png"></img>
            <div style={{ color:"black"}}>
                <FormControl style={{width:"100%"}} >
                        <TextField
                            style = {{top:"2px", marginBottom:"25px"}}
                                id="input-with-icon-textfield"
                                placeholder="Email Address"
                                type="input"
                                onChange={event => setEmail(event.target.value)}
                                label="ID"
                                inputProps={{ style: { textAlign: 'center',fontSize:"19px", fontFamily: 'Cafe24Oneprettynight' },
                                'aria-label': 'naked',
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),}}
                                InputLabelProps={{ 
                                    style:{fontSize:"15px", fontFamily: 'TmoneyRoundWindExtraBold'}
                                    }}
                        />
                                <TextField

                                style = {{top:"2px", marginBottom:"25px", color:"black"}}
                                id="input-with-icon-textfield"
                                placeholder="Enter Password"
                                type="password"
                                autoComplete="current-password"
                                onChange={event => setPassword(event.target.value)}
                                label="PASSWORD"
                                inputProps={{ style: { textAlign: 'center',fontSize:"19px", color:"black" },
                                'aria-label': 'naked',
                                }}
                                InputLabelProps={{ 
                                    style:{fontSize:"15px", fontFamily: 'TmoneyRoundWindExtraBold'}
                                    }}
                        />
                    <Button
                        disabled={authenticating}
                        variant="outlined"
                        onClick={() => signInWithEmailAndPassword()}
                        style={{width:"50%", margin:"auto"}}
                    >
                        로그인
                    </Button>
                    <div style={{fontSize:"13px",padding:"10px"}}>
                        <small>
                            <p className='m-1 text-center'> 신입이신가요? <Link to="/register">여기를 눌러주세요.</Link></p>
                            {/* <p className='m-1 text-center'><Link to="/forget">패스워드를 잊어버리셧나요?</Link></p> */}
                        </small>
                    </div>
                    <ErrorText error={error} />
                </FormControl>
            </div>
        </div>
    );
}

export default LoginPage;