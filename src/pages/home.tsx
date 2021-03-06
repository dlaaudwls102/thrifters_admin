import { Button, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';

const useStyles = makeStyles({
    flexGrow: {
        flex: '1',
    },
    button: {
        fontSize: '13px',
        backgroundColor: '#fff',
        borderRadius: '1rem',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#FBAA13',
            color: '#07381B',
        },
    },
});

const HomePage: React.FunctionComponent<IPageProps> = (props) => {
    const [username, setUsername] = useState(auth.currentUser?.displayName);
    const [numberOfRequest, setNumberOfRequest] = useState();
    const [numberOfCalculated, setNumberOfCalculated] = useState();
    const [numberOfCalculated_Offline, setNumberOfCalculated_Offline] = useState();
    const [numberOfPaid, setNumberOfPaid] = useState();
    const [numberOfPaid_Offline, setNumberOfPaid_Offline] = useState();
    const classes = useStyles();
    const history = useHistory();
    //   const setupUser = (data: any) => {
    //     data.forEach((doc: any) => {
    //       const user = doc.data();
    //     });
    //   };

    const [dispSetDone, setDispSetDone] = useState<boolean>(
        auth.currentUser?.displayName !== undefined
    );

    //   db.collection("user")
    //     .get()
    //     .then((snapshot) => {
    //       setupUser(snapshot.docs);
    //     });
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user?.displayName) {
                setDispSetDone(true);
            }
        });
    }, []);

    useEffect(() => {
        db.collection('orders')
            .doc('user')
            .get()
            .then((doc) => {
                if (doc.data()!.orders) {
                    var request = doc!
                        .data()!
                        .orders.filter(
                            (order: any) => order.confirmed === '?????????'
                        );
                    var count: any = 0;
                    request!.forEach((data: any) => {
                      if (data.name) count += 1;
                  });
          
                  setNumberOfRequest(count);
                    var calculated = doc!
                        .data()!
                        .orders.filter(
                            (order: any) => order.confirmed === '??????'
                        );
                    var count2 : any = 0;
                    calculated!.forEach((data: any) => {
                      if (data.name) count2 += 1;
                  });
 
                  setNumberOfCalculated(count2);
                    var paid = doc!
                        .data()!
                        .orders.filter(
                            (order: any) => order.confirmed === '??????'
                        );
                    var count3 : any = 0;
                    paid!.forEach((data: any) => {
                      if (data.name) count3 += 1;
                  });
   
                  setNumberOfPaid(count3);

                }
            });
    }, []);
    useEffect(() => {
      db.collection('orders')
          .doc('non_user')
          .get()
          .then((doc) => {
              if (doc.data()!.orders) {
                 
                  var calculated = doc!
                      .data()!
                      .orders.filter(
                          (order: any) => order.confirmed === '??????'
                      );
                  var count2 : any = 0;
                  calculated!.forEach((data: any) => {
                    if (data.name) count2 += 1;
                });
        
                setNumberOfCalculated_Offline(count2);
                  var paid = doc!
                      .data()!
                      .orders.filter(
                          (order: any) => order.confirmed === '??????'
                      );
                  var count3 : any = 0;
                  paid!.forEach((data: any) => {
                    if (data.name) count3 += 1;
                });

                setNumberOfPaid_Offline(count3);

              }
          });
  }, []);

    const saveUserName = (name: string) => {
        auth.currentUser
            ?.updateProfile({
                displayName: name,
            })
            .then(function () {
                console.log('Display name updated');
            })
            .catch(function (error) {
                console.error(error);
            });
        setDispSetDone(true);
    };
    return (
        <div>
            <div className="Header_center fade">
                <div>
                    <img
                        className="img-logo"
                        src="./thrifter_logo.png"
                        alt=""
                    />
                </div>
            </div>

            {!dispSetDone ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            color: 'black',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        }}
                    >
                        <p>???????????????, ????????? ????????? ?????????</p>
                    </div>
                    <div style={{ width: '100%', position: 'relative' }}>
                        <TextField
                            style={{
                                top: '2px',
                                marginBottom: '25px',
                                color: 'black',
                            }}
                            id="input-with-icon-textfield"
                            placeholder="????????? ???????????????"
                            type="text"
                            autoComplete="current-password"
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            label="??????"
                            inputProps={{
                                style: {
                                    textAlign: 'center',
                                    fontSize: '19px',
                                    color: 'black',
                                },
                                'aria-label': 'naked',
                            }}
                            InputLabelProps={{
                                style: {
                                    fontSize: '15px',
                                    fontFamily: 'TmoneyRoundWindExtraBold',
                                },
                            }}
                        />
                        <div>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    saveUserName(username!);
                                }}
                                style={{ width: '50%', margin: 'auto' }}
                            >
                                ????????????
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    id="pot"
                    style={{
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'column',
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            color: 'black',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        }}
                    >
                        <p>???????????????, {username} ???</p>
                    </div>
                    <div id="pot" style={{ padding: '0 0 20px 0' }}>
                        <Button
                            className={classes.button}
                            variant="outlined"
                            onClick={() => {
                                history.push('/calendar');
                            }}
                            style={{
                                width: '65%',
                                padding: '10px',
                                margin: 'auto',
                                border: 'solid 2px',
                                borderRadius: '10rem',
                                color: 'black',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            }}
                        >
                            ?????? ??????
                        </Button>
                    </div>
                    <div id="pot" style={{ padding: '0 0 20px 0' }}>
                        <Button
                            className={classes.button}
                            variant="outlined"
                            onClick={() => {
                                history.push('/requests');
                            }}
                            style={{
                                width: '65%',
                                padding: '10px',
                                margin: 'auto',
                                border: 'solid 2px',
                                borderRadius: '10rem',
                                color: 'black',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            }}
                        >
                            {numberOfRequest !== 0 && (
                                <div className="notification">
                                    {numberOfRequest}
                                </div>
                            )}
                            ?????? ??????
                        </Button>
                    </div>
                    <div id="pot" style={{ padding: '0 0 20px 0' }}>
                        <Button
                            className={classes.button}
                            variant="outlined"
                            onClick={() => {
                                history.push('/finalize');
                            }}
                            style={{
                                width: '65%',
                                padding: '10px',
                                margin: 'auto',
                                border: 'solid 2px',
                                borderRadius: '10rem',
                                color: 'black',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            }}
                        >
                                   {numberOfCalculated !== 0 && (
                                <div className="notification">
                                    {numberOfCalculated}
                                </div>
                            )}
                                   {numberOfCalculated_Offline !== 0 && (
                                <div className="notification2">
                                    {numberOfCalculated_Offline}
                                </div>
                            )}
                            ?????? ??????
                        </Button>
                    </div>
                    <div id="pot" style={{ padding: '0 0 20px 0' }}>
                        <Button
                            className={classes.button}
                            variant="outlined"
                            onClick={() => {
                                history.push('/payment');
                            }}
                            style={{
                                width: '65%',
                                padding: '10px',
                                margin: 'auto',
                                border: 'solid 2px',
                                borderRadius: '10rem',
                                color: 'black',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            }}
                        >
                                  {numberOfPaid !== 0 && (
                                <div className="notification">
                                    {numberOfPaid}
                                </div>
                            )}
                                   {numberOfPaid_Offline !== 0 && (
                                <div className="notification2">
                                    {numberOfPaid_Offline}
                                </div>
                            )}
                            ?????? ??????
                        </Button>
                    </div>
                    <div id="pot" style={{ padding: '0 0 20px 0' }}>
                        <Button
                            className={classes.button}
                            variant="outlined"
                            onClick={() => {
                                history.push('/QR_Reader');
                            }}
                            style={{
                                width: '65%',
                                padding: '10px',
                                margin: 'auto',
                                border: 'solid 2px',
                                borderRadius: '10rem',
                                color: 'black',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            }}
                        >
                            QR ??????
                        </Button>
                    </div>
                    <div id="pot" style={{ padding: '0 0 20px 0' }}>
                        <Button
                            className={classes.button}
                            variant="outlined"
                            onClick={() => {
                                history.push('/logout');
                            }}
                            style={{
                                width: '65%',
                                padding: '10px',
                                margin: 'auto',
                                border: 'solid 2px',
                                borderRadius: '10rem',
                                color: 'black',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            }}
                        >
                            ????????????
                        </Button>
                    </div>
                </div>
            )}
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
};

export default HomePage;
