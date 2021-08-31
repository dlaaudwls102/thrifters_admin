import { FormControl, InputAdornment, TextField, Button } from '@material-ui/core';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';
import ErrorText from '../../components/ErrorText';
import { auth, db } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';

const RegisterPage: React.FunctionComponent<IPageProps> = props => {
    const [registering, setRegistering] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    
    //직원 마스터코드
    const [masterCode, setMasterCode] = useState<string>('');
    const [checkMasterCode, setCheckMasterCode] = useState<string>('videhome671009*');


    const history = useHistory();

    const signUpWithEmailAndPassword = () => {
        if (password !== confirm)
        {
            setError('패스워드가 같은지 다시확인해 주시기 바랍니다.');
            return;
        }
        if (masterCode !== checkMasterCode)
        {
            setError('마스터코드가 다릅니다. 마스터코드를 직속 상사에게 받아오신후 작성해주세요.');
            return;
        }

        if (error !== '') setError('');

        setRegistering(true);
        auth.createUserWithEmailAndPassword(email, password)
        .then(result => {
            logging.info(result);
            history.push('/login');
        })
        .catch(error => {
            logging.error(error);

            if (error.code.includes('auth/weak-password'))
            {
                setError('더욱 복잡한 비밀번호를 입력해주세요.');
            }
            else if (error.code.includes('auth/email-already-in-use'))
            {
                setError('이미 사용중에있는 이메일입니다.');
            }
            else
            {
                setError('서버가 다운되었습니다. 나중에 다시 해주세요.')
            }

            setRegistering(false);
        });

            auth.currentUser?.updateProfile({
                displayName: name,
            }).then(function() {
                console.log("Display name updated");
            }).catch(function(error) {
                console.error(error)
            });
        
        db.collection('admin').doc(email).set({
             
                userId: email,
                name: name,
                phone: phone,  
                orders:[],
                totalWeight: 0,
                numberOfOrders: 0,
                averageWeights: 0,
                privacyAgree : false,
                rank : 0,
            
        });
    }

    const handleChange = (prop : string) => (event: any) => {

        if (prop == "email_"){
            setEmail(event.target.value.toLocaleLowerCase())
        }
        else  if (prop == "password_"){
            setPassword(event.target.value)
        }
        else  if (prop == "confirm_"){
            setConfirm(event.target.value)
        }
        else  if (prop == "name_"){
            setName(event.target.value)
        }
        else  if (prop == "masterCode_"){
            setMasterCode(event.target.value)
        }
        else  if (prop == "phone_"){
           
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length < 11) {
                setPhone(onlyNums)
            } 
            else if (onlyNums.length === 11) {
                const number = onlyNums.replace(
                    /(\d{3})(\d{4})(\d{4})/,
                    '($1) $2-$3'
                );
                setPhone(number)
            }
        }
    }


    return (
        <div>
            <img className="img-logo-login" src="./videhome_logo.png"></img>
            <div style={{ color:"black"}}>
                <FormControl style={{width:"100%"}} >
                        <TextField
                                autoComplete="new-password"
                                  name="confirm"
                                  id="confirm"
                                style = {{top:"2px", marginBottom:"25px", color:"black"}}
                                placeholder="성함을 입력해주세요"
                                type="input"
                                onChange={handleChange("name_")}
                                label="성함"
                                inputProps={{ style: { textAlign: 'center',fontSize:"19px", fontFamily: 'Cafe24Oneprettynight'},
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
                                autoComplete="new-password"
                                  name="confirm"
                                  id="confirm"
                                style = {{top:"2px", marginBottom:"25px", color:"black"}}
                                placeholder="전화번호를 입력해주세요"
                                type="input"
                                value={phone}
                                onChange={handleChange("phone_")}
                                label="전화번호"
                                inputProps={{ style: { textAlign: 'center',fontSize:"19px"},
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
                            style = {{top:"2px", marginBottom:"25px"}}
                                id="input-with-icon-textfield"
                                placeholder="이메일 주소"
                                type="input"
                                onChange={handleChange("email_")}
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
                                autoComplete="new-password"
                                style = {{top:"2px", marginBottom:"25px", color:"black"}}
                                id="input-with-icon-textfield"
                                placeholder="비밀번호 입력"
                                type="password"
                     
                                onChange={handleChange("password_")}
                                label="비밀번호"
                                inputProps={{ style: { textAlign: 'center',fontSize:"19px"},
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
                                autoComplete="new-password"
                                  name="confirm"
                                  id="confirm"
                                style = {{top:"2px", marginBottom:"25px", color:"black"}}
                                placeholder="비밀먼호 재입력"
                                type="password"
                       
                                onChange={handleChange("confirm_")}
                                label="패스워드 재입력"
                                inputProps={{ style: { textAlign: 'center',fontSize:"19px"},
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
                                autoComplete="new-password"
                                  name="confirm"
                                  id="confirm"
                                style = {{top:"2px", marginBottom:"25px", color:"black"}}
                                placeholder="마스터 코드를 입력해주세요"
                                type="password"
                       
                                onChange={handleChange("masterCode_")}
                                label="마스터 코드"
                                inputProps={{ style: { textAlign: 'center',fontSize:"19px"},
                                'aria-label': 'naked',
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),}}
                                InputLabelProps={{ 
                                    style:{fontSize:"15px", fontFamily: 'TmoneyRoundWindExtraBold'}
                                    }}
                                />
                                     <Button
                    disabled={registering}
                        variant="outlined"
                        onClick={() => signUpWithEmailAndPassword()}
                        style={{width:"50%", margin:"auto"}}
                    >
                        회원가입
                    </Button>
                    <div style={{fontSize:"15px",padding:"10px"}}>
                        <small>
                            <p className='m-1 text-center'>이미 직원이신가요? <Link to="/login">로그인.</Link></p>
                        </small>
                    </div>
                    <ErrorText error={error} />
                </FormControl>


                </div>
        </div>
    );
}

export default RegisterPage;