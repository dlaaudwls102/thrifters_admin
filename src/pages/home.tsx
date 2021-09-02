import { Button, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';


const useStyles = makeStyles({
    flexGrow: {
      flex: '1',
    },
    button: {
        fontSize:"13px",
        backgroundColor: '#fff',
      borderRadius:"1rem",
      color: '#fff',
      '&:hover': {
        backgroundColor: '#FBAA13',
        color: '#07381B',
    },
  }})

const HomePage: React.FunctionComponent<IPageProps> = props => {
    const [username, setUsername] = useState(auth.currentUser?.displayName);
    const classes = useStyles()

    const userList = document.querySelector('.user');
    const setupUser = (data:any) =>{
        data.forEach((doc:any) => {
            const user = doc.data();
        })
    }

    const [dispSetDone,setDispSetDone] = useState<boolean>(auth.currentUser?.displayName != undefined);
   
    db.collection('user').get().then(snapshot =>{
        setupUser(snapshot.docs);
    });
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user?.displayName)
            {
                setDispSetDone(true);
            }
        })
    }, []);

    const saveUserName = (name: string) =>{
        auth.currentUser?.updateProfile({
            displayName: name,
          }).then(function() {
            console.log("Display name updated");
          }).catch(function(error) {
            console.error(error)
          });
          setDispSetDone(true);
    }
    return (
       <div>
            <div className="Header_center fade">
             <div>
                <img className="img-logo" src="./videhome_logo.png"></img>
            </div>
            </div>

            
        {(!dispSetDone)? <div style={{display:"flex",flexDirection:"column"}}>
            <div style={{color:"black", fontFamily: 'TmoneyRoundWindExtraBold'}}>
                <p>환영합니다, 별명을 설정해 주세요</p>     
            </div>
            <div style={{width:"100%", position:"relative"}}>
            <TextField
                    style = {{top:"2px", marginBottom:"25px", color:"black"}}
                    id="input-with-icon-textfield"
                    placeholder="별명을 설정주세요"
                    type="text"
                    autoComplete="current-password"
                    onChange={event => setUsername(event.target.value)}
                    label="별명"
                    inputProps={{ style: { textAlign: 'center',fontSize:"19px", color:"black" },
                    'aria-label': 'naked',
                    }}
                    InputLabelProps={{ 
                        style:{fontSize:"15px", fontFamily: 'TmoneyRoundWindExtraBold'}
                        }}
                    />
            <div>
                <Button     
                    variant="outlined"
                    onClick={() => {saveUserName(username!)}}
                    style={{width:"50%", margin:"auto"}}>
                    저장하기</Button>
            </div>
            </div>
        </div>
        :
            <div id='pot' style={{display:"flex", position:"relative", flexDirection:"column"}}>
                <div style={{color:"black", fontFamily: 'TmoneyRoundWindExtraBold'}}>
                    <p>안녕하세요, {username} 님</p>     
                </div>
                
                <div id='pot' style={{padding:"0 0 20px 0"}}>
                    <Button className={classes.button}
                        variant="outlined"

                        style={{width:"70%",padding:"10px", margin:"auto", }}
                    >
                        <Link to='/QR_Reader' style={{textDecoration:"none", fontFamily:'TmoneyRoundWindExtraBold', color:"black"}}>QR 스캔</Link>
                    </Button>
                </div>
                <div id='pot'>
                    <Button className={classes.button}
                        variant="outlined"

                        style={{width:"70%",padding:"10px", margin:"auto"}}
                    >
                        <Link to='/logout' style={{textDecoration:"none", fontFamily:'TmoneyRoundWindExtraBold', color:"black"}}>로그아웃</Link>
                    </Button>
                </div>
                    
                    </div>}  
            {/* <Card>
                <CardBody>
                    <p>
                        Welcome to this page that is protected by Friebase auth!
                    </p>
                    <p>
                        Change your password <Link to="/change">here</Link>.
                    </p>
                    <p>
                        Click <Link to='/logout'>here</Link> to logout.
                    </p>
                </CardBody>
            </Card> */}
       </div>
    );
}

export default HomePage;