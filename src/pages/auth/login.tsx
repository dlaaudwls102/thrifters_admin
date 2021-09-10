import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import { auth, db } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';
import { FormControl, InputAdornment, TextField, Button } from '@material-ui/core';
// import { SignInWithSocialMedia } from './modules';

const LoginPage: React.FunctionComponent<IPageProps> = props => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    
    const history = useHistory();


    const signInWithEmailAndPassword = () => {
        if (error !== '') setError('');

        setAuthenticating(true);
        db.collection('admin').doc(email.toLocaleLowerCase()).get().then((doc)=>{
            if (doc.exists) {
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
            } else {
                setError("관리자 모드입니다. 다시 확인해주세요");
                // doc.data() will be undefined in this case
                setAuthenticating(false);
            }
        })
    }

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user)
            {
                logging.info('User detected.');
                history.push("/")
            }
            else
            {
                logging.info('No user detected');
            }
        })
    }, []);

    // const signInWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
    //     if (error !== '') setError('');

    //     setAuthenticating(true);

    //     SignInWithSocialMedia(provider)
    //     .then(result => {
    //         logging.info(result);
    //         history.push('/');
    //     })
    //     .catch(error => {
    //         logging.error(error);
    //         setAuthenticating(false);
    //         setError(error.message);
    //     });
    // }


    return (
        <div>
              <img className="img-logo-login" src="./videhome_logo.png" alt=""/>
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