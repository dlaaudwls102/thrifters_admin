import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PaymentIcon from '@mui/icons-material/Payment';
import { auth, db } from '../config/firebase';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const TopNav = () => {
    const [page, setPage] = useState<Number | null>(0);
    const [numberOfOrders, setNumberOfOrders] = useState<any | null>(0);
    const [numberOfOrders_Offline, setNumberOfOrders_Offline] = useState<any | null>(0);
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const history = useHistory();

    useEffect(() => {
        var count = 0
        db.collection('orders')
            .doc('user')
            .get()
            .then((doc) => {
                if (doc.data()!.orders) {
                    count = count + doc!.data()!.orders.length;
                    setNumberOfOrders(doc!.data()!.orders.length);
                }
            });
            db.collection('orders')
            .doc('non_user')
            .get()
            .then((doc) => {
                if (doc.data()!.orders) {
                    count = count + doc!.data()!.orders.length;
                    setNumberOfOrders_Offline(doc!.data()!.orders.length);
                }
            });
    }, [state.left]);
    const onClickHeaderBtn = (path: number, name: string) => {
        setPage(path);
        history.push(name);
    };

    const toggleDrawer = (anchor: Anchor, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    const list = (anchor: Anchor) => (
        <Box
            sx={{
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            style={{
                overflowX: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}
            >
                {/* <img className="img-logo-side" src="./thrifter_side.png"></img> */}
                <div
                    style={{
                        fontFamily: 'ONE-Mobile-POP',
                        justifyContent: 'center',
                        display: 'flex',
                        margin: 'auto',
                        marginLeft: '10px',
                        fontSize: '20px',
                    }}
                >
                    쓰리프터 (주)
                </div>
                <Button onClick={toggleDrawer('left', false)}>
                    <CloseIcon />
                </Button>
            </div>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: '#07381B',
                    borderTop: 'solid 5px #FBAA13',
                    borderBottom: 'solid 5px #FBAA13',
                }}
            >
                <div
                    style={{
                        border: 'solid 2px #FBAA13',
                        background: 'white',
                        height: '100px',
                        width: '100px',
                        borderRadius: '100%',
                        margin: 'auto',
                        marginTop: '20px',
                        justifyContent: 'center',
                        zIndex: 2,
                    }}
                >
                    <img
                        className="img-logo"
                        src="./thrifter_logo.png"
                        style={{
                            margin: '10px',
                            width: '70%',
                            position: 'relative',
                        }}
                    ></img>
                </div>
                <div
                    style={{
                        fontFamily: 'ONE-Mobile-POP',
                        padding: '20px',
                        fontSize: '15px',
                        color: 'white',
                    }}
                >
                    {auth.currentUser?.displayName !== undefined ? (
                        <>안녕하세요, {auth.currentUser?.displayName + ' 님'}</>
                    ) : (
                        <> 로그인 해주세요</>
                    )}
                </div>
                <div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <Divider />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    padding: '20px 0',
                    fontFamily: 'ONE-Mobile-POP',
                }}
            >
                <div
                    style={{ justifyContent: 'center', textAlign: 'center' }}
                    onClick={onClickHeaderBtn.bind(this, 1, '/requestOnSite')}
                >
                    <div>
                        <AddBusinessIcon fontSize="medium" />
                    </div>
                    <div>방문신청</div>
                </div>
                <div
                    style={{ justifyContent: 'center', textAlign: 'center' }}
                    onClick={onClickHeaderBtn.bind(this, 1, '/calendar')}
                >
                    <div>
                        <CalendarTodayIcon fontSize="medium" />
                    </div>
                    <div>나의 일정</div>
                </div>
                <div
                    style={{ justifyContent: 'center', textAlign: 'center' }}
                    onClick={onClickHeaderBtn.bind(this, 1, '/QR_Reader')}
                >
                    <div>
                        <QrCodeScannerIcon fontSize="medium" />
                    </div>
                    <div>QR리더</div>
                </div>
            </div>
            <Divider />
            {auth.currentUser?.uid ? (
                <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            flexDirection: 'row',
                            padding: '20px 0',
                            fontFamily: 'ONE-Mobile-POP',
                        }}
                    >
                        <div
                            style={{
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                            onClick={onClickHeaderBtn.bind(
                                this,
                                1,
                                '/requests'
                            )}
                        >
                            <div
                                style={{ paddingBottom: '10px', color: 'red' }}
                            >
                                {numberOfOrders+numberOfOrders_Offline}
                            </div>
                            <div>신청건수</div>
                        </div>
                        <div
                            style={{
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                            onClick={onClickHeaderBtn.bind(
                                this,
                                1,
                                '/currency'
                            )}
                        >
                            <div>
                                <MonetizationOnIcon fontSize="medium" />
                            </div>
                            <div>시세조정</div>
                        </div>
                    </div>
                    <Divider />
                    <div
                        style={{
                            textAlign: 'left',
                            fontFamily: 'ONE-Mobile-POP',
                            padding: '20px',
                            fontSize: '20px',
                        }}
                    >
                        비드홈
                    </div>
                    <div
                        style={{
                            padding: ' 0 10px 10px 20px',
                            fontFamily: 'ONE-Mobile-POP',
                        }}
                    >
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'매입신청 확인'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/requests'
                                )}
                            >
                                <ListItemIcon>
                                    <ScheduleIcon />
                                </ListItemIcon>
                                <ListItemText primary={'매입신청 확인'} />
                            </ListItem>
                        </div>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'방문 및 정산'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/finalize'
                                )}
                            >
                                <ListItemIcon>
                                    <LocalShippingIcon />
                                </ListItemIcon>
                                <ListItemText primary={'방문 및 정산'} />
                            </ListItem>
                        </div>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'송금확인'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/payment'
                                )}
                            >
                                <ListItemIcon>
                                    <PaymentIcon />
                                </ListItemIcon>
                                <ListItemText primary={'송금확인'} />
                            </ListItem>
                        </div>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'주문완료 현황'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/confirmed'
                                )}
                            >
                                <ListItemIcon>
                                    <AssignmentTurnedInIcon />
                                </ListItemIcon>
                                <ListItemText primary={'주문완료 현황'} />
                            </ListItem>
                        </div>
                    </div>
                    <Divider />
                    <div
                        style={{
                            textAlign: 'left',
                            fontFamily: 'ONE-Mobile-POP',
                            padding: '20px',
                            fontSize: '20px',
                        }}
                    >
                        고객
                    </div>
                    <div style={{ padding: ' 0 10px 10px 20px' }}>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'고객정보'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/customer_list'
                                )}
                            >
                                <ListItemIcon>
                                    <PersonOutlineIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={'고객정보'}
                                    style={{ fontFamily: 'ONE-Mobile-POP' }}
                                />
                            </ListItem>
                        </div>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'필요요청'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/customer_needs'
                                )}
                            >
                                <ListItemIcon>
                                    <EmojiPeopleOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={'필요신청 확인'}
                                    style={{ fontFamily: 'ONE-Mobile-POP' }}
                                />
                            </ListItem>
                        </div>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'고객랭킹'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/ranking'
                                )}
                            >
                                <ListItemIcon>
                                    <ThumbUpOffAltIcon />
                                </ListItemIcon>
                                <ListItemText primary={'고객랭킹'} />
                            </ListItem>
                        </div>
                    </div>
                    <Divider />
                    <div
                        style={{
                            textAlign: 'left',
                            fontFamily: 'ONE-Mobile-POP',
                            padding: '20px',
                            fontSize: '20px',
                        }}
                    >
                        직원
                    </div>
                    <div style={{ padding: ' 0 10px 10px 20px' }}>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'직원정보'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/customer_list'
                                )}
                            >
                                <ListItemIcon>
                                    <PersonOutlineIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={'직원정보'}
                                    style={{ fontFamily: 'ONE-Mobile-POP' }}
                                />
                            </ListItem>
                        </div>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'교육영상'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/video_lecture'
                                )}
                            >
                                <ListItemIcon>
                                    <OndemandVideoIcon />
                                </ListItemIcon>
                                <ListItemText primary={'교육영상'} />
                            </ListItem>
                        </div>
                        <div style={{ padding: '5px' }}>
                            <ListItem
                                button
                                key={'매입절차'}
                                onClick={onClickHeaderBtn.bind(
                                    this,
                                    1,
                                    '/process_info'
                                )}
                            >
                                <ListItemIcon>
                                    <HelpOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary={'매입절차'} />
                            </ListItem>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}

            {/* <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List> */}
        </Box>
    );

    return (
        <div
            className="topnav"
            id="myTopnav"
            style={{ justifyContent: 'space-between', overflowX: 'hidden' }}
        >
            <a
                id="0"
                onClick={onClickHeaderBtn.bind(this, 0, '/')}
                className={page == 0 ? 'pressed' : ''}
            >
                <img style={{ width: '65%' }} src="./thrifter_logo.png"></img>
            </a>
            {/* <a
                id="1"
                onClick={onClickHeaderBtn.bind(this, 1, '/apply')}
                className={page == 1 ? 'pressed' : ''}
            >
                판매신청
            </a>
            <a
                id="2"
                onClick={onClickHeaderBtn.bind(this, 2, '/transaction')}
                className={page == 2 ? 'pressed' : ''}
            >
                거래내역
            </a>
            <a
                id="3"
                onClick={onClickHeaderBtn.bind(this, 3, '/bulletin_board')}
                className={page == 3 ? 'pressed' : ''}
            >
                공지사항
            </a>
            <a
                id="4"
                onClick={onClickHeaderBtn.bind(this, 4, '/setting')}
                className={page == 4 ? 'pressed' : ''}
            >
                내정보
            </a> */}
            <React.Fragment key={'left'}>
                <Button
                    onClick={toggleDrawer('left', true)}
                    style={{ color: '#07381B' }}
                >
                    <MenuIcon fontSize="large" />
                </Button>
                <SwipeableDrawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                    onOpen={toggleDrawer('left', true)}
                >
                    {list('left')}
                </SwipeableDrawer>
            </React.Fragment>
            {/* <React.Fragment key={'left'}>
                <Button
                    onClick={toggleDrawer('left', true)}
                    style={{ color: '#07381B' }}
                >
                    <MenuIcon fontSize="large" />
                </Button>
                <SwipeableDrawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                    onOpen={toggleDrawer('left', true)}
                >
                    {list('left')}
                </SwipeableDrawer>
            </React.Fragment> */}
        </div>
    );
};

export default TopNav;
