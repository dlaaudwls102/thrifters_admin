import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';

const LogoutPage: React.FunctionComponent<IPageProps> = props => {
    const history = useHistory();

    const Logout = () => {
        auth.signOut()
        .then(() => history.push('/login'))
        .catch(error => logging.error(error));
    }

    return (
        <div>
            <img className="img-logo-login" src="./thrifter_logo.png" alt=""/>
        <div>
            <p className='text-center' style={{fontSize:"20px", fontFamily: 'TmoneyRoundWindExtraBold', color:"black"}}>로그아웃 하시겠습니까?</p>
            <div className='text-center' style={{display:"flex",position:"relative"}}>
                <Button
                        variant="outlined"
                        onClick={() => history.push("/")}
                        style={{ margin:"auto", width:"100px"}}
                    >
                        취소
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => Logout()}
                        style={{ margin:"auto", width:"100px"}}
                    >
                        확인
                    </Button>
            </div>
        </div>
        </div>
    );
}

export default LogoutPage;