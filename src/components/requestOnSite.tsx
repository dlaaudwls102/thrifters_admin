import React, { useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import {
    Button,
    createStyles,
    FormControlLabel,
    InputLabel,
    Select,
    Theme,
    withStyles,
} from '@material-ui/core';
import Webcam from 'react-webcam';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';

import { auth, db } from '../config/firebase';
import { green } from '@material-ui/core/colors';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import InputBase from '@material-ui/core/InputBase';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
        root: {
            'label + &': {
                position: 'relative',
            },
        },
        input: {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: theme.palette.background.paper,
            border: 'none',
            fontSize: 16,
            padding: '10px 26px 10px 12px',
            transition: theme.transitions.create([
                'border-color',
                'box-shadow',
            ]),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
                'TmoneyRoundWindExtraBold',
            ].join(','),
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
        },
    })
)(InputBase);
const choices = [
    {
        value: 101,
        label: '자택',
    },
    {
        value: 102,
        label: '매장',
    },
];
const ways = [
    {
        value: 11,
        label: '대면',
    },
    {
        value: 22,
        label: '비대면 (문앞)',
    },
];
const stores = [
    {
        value: 1020,
        label: '중산점',
    },
    {
        value: 1021,
        label: '마두점(준비중)',
    },
    {
        value: 1022,
        label: '주엽점(준비중)',
    },
    {
        value: 1023,
        label: '대화점(준비중)',
    },
    {
        value: 1024,
        label: '백석점(준비중)',
    },
];

function RequestOnSite() {
    const getTel = () => {
        if (tel !== undefined) {
            return tel;
        } else {
            return '0';
        }
    };
    const addInfo = () => {
        if (
            name === undefined ||
            address === undefined ||
            tel === undefined ||
            dDay === undefined ||
            hour === undefined ||
            minute === undefined ||
            accountNumber === undefined
        ) {
            alert('모든 입력란을 작성하시고 눌러주세요.');
        } else {
            const year = dDay.toString().slice(0, 4);
            const month = dDay.toString().slice(5, 7);
            const day = dDay.toString().slice(8, 11);
            const check: number = day_of_week(
                Number(year),
                Number(month),
                Number(day)
            );
            setAnswer(check);
            // if (0 < check && check <= 5) {
            var finalWay = '';
            if (way === 22) {
                finalWay = '비대면 (문앞)';
            } else {
                if (cate === 101) {
                    finalWay = '자택';
                } else {
                    if (store === 1024) {
                        finalWay = '백석점(즌비중)';
                    } else if (store === 1021) {
                        finalWay = '마두점(준비중)';
                    } else if (store === 1022) {
                        finalWay = '주엽점(준비중)';
                    } else if (store === 1023) {
                        finalWay = '대화점(준비중)';
                    } else {
                        finalWay = '중산점';
                    }
                }
            }
            if (
                name === undefined ||
                address === undefined ||
                tel === undefined ||
                dDay === undefined ||
                hour === undefined ||
                minute === undefined
            ) {
                alert('모든 입력란을 작성하시고 눌러주세요.');
            } else {
                alert(name + ' 고객님, 신청서 저장 완료되었습니다.');
                setFilled(true);
                setRealWay(finalWay);
            }
        }
        //  else {
        //     alert('평일신청만 가능합니다. 다시 선택해주세요');
        //     setDDay('yyyy-MM-dd');
        //     return;
        // }
        // }
    };
    const history = useHistory();

    const delay = (ms: any) => new Promise((res: any) => setTimeout(res, ms));
    const calcMass = async () => {
        if (consentAgreement1 === false) {
            alert('필수 약관에 동의해주시기 바랍니다.');
        } else if (!auth.currentUser?.displayName!) {
            alert(
                '회원정보를 다 입력하시고 저장하기를 누르셧는지 확인해주세요.'
            );
        } else {
            //Timestamp
            const timeStamp = Date.now();
            const messages = {
                date: date,
                setDate: dDay,
                time: hour + ':' + minute,
                way: realWay + ' 방문(QR)',
                read: false,
                title: '판매신청',
                info: '신청정보',
            };
            const orders = {
                date: dDay,
                time: hour + ':' + minute,
                way: realWay + ' 방문(QR)',
                weight: 0,
                additional: 0,
                userId: ' 방문(QR)',
                confirmed: '확인',
                confirmed_By: auth.currentUser?.displayName!,
                name: name,
                address: address,
                phone: tel,
                uid: uid,
                timeStamp: new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }).format(timeStamp),
                category: {
                    clothes: 0,
                    bags: 0,
                    shoes: 0,
                    fashion: 0,
                    books: 0,
                    steel: 0,
                    non_steel: 0,
                },
            };
            const BOrders = {
                name: name,
                address: address,
                phone: tel,
                accountNumber: accountNumber,
                bank_type: selectedBank,
                date: dDay,
                time: hour + ':' + minute,
                way: realWay + ' 방문(QR)',
                weight: 0,
                additional: 0,
                confirmed: '확인',
                userId: 'non_user',
                timeStamp: new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }).format(timeStamp),
                category: {
                    clothes: 0,
                    bags: 0,
                    shoes: 0,
                    fashion: 0,
                    books: 0,
                    steel: 0,
                    non_steel: 0,
                },
            };
            if (uid !== '') {
                var workPlan: any = {};
                var workPlan2: any = {};
                workPlan2[dDay] = {
                    time: hour + ':' + minute,
                    date: dDay,
                    name: name + ' 방문(QR)',
                    address: address,
                    phone: tel,
                    user: name,
                };
                workPlan[dDay.slice(0, 7)] = workPlan2;
                db.collection('showWork')
                    .doc('planner')
                    .update({
                        requested: firebase.firestore.FieldValue.arrayUnion(
                            workPlan
                        ),
                    });
                const calendar_item = {
                    start: dDay + 'T' + hour + ':' + minute + ':00',
                    end: dDay + 'T' + hour + ':' + minute + ':00',
                    id: uid,
                    title: name + '님 매입신청' + ' 방문(QR)',
                };

                db.collection('showWork')
                    .doc('calendar')
                    .update({
                        request: firebase.firestore.FieldValue.arrayUnion(
                            calendar_item
                        ),
                    });
                db.collection('user')
                    .doc(uid)
                    .update({
                        orders: firebase.firestore.FieldValue.arrayUnion(
                            orders
                        ),
                        message: firebase.firestore.FieldValue.arrayUnion(
                            messages
                        ),
                        numberOfOrders: firebase.firestore.FieldValue.increment(
                            1
                        ),
                        totalWeight: firebase.firestore.FieldValue.increment(0),
                        totalAdditional: firebase.firestore.FieldValue.increment(
                            0
                        ),
                        privacyAgree: true,
                        accountNumber: accountNumber,
                        bank_type: selectedBank,
                    });
                db.collection('admin')
                    .doc(auth.currentUser?.uid)
                    .update({
                        orders: firebase.firestore.FieldValue.arrayUnion(
                            orders
                        ),
                        numberOfOrders: firebase.firestore.FieldValue.increment(
                            1
                        ),
                    });
                db.collection('orders')
                    .doc('user')
                    .update({
                        orders: firebase.firestore.FieldValue.arrayUnion(
                            orders
                        ),
                    });
                // .then((message) => console.log(message)
                // );
                setDone(true);
                alert('회원 직접방문 수거신청이 완료되었습니다.');
                setIsLoading(true);
                await delay(3000);
                setIsLoading(false);
                history.push('/');
            } else {
                var workPlan: any = {};
                workPlan[dDay] = {
                    date: dDay,
                    name: name + ' 방문(비회원)',
                    address: address,
                    phone: tel,
                    user: 'non_user',
                };
                db.collection('showWork')
                    .doc('planner')
                    .update({
                        requested: firebase.firestore.FieldValue.arrayUnion(
                            workPlan
                        ),
                    });

                const calendar_item = {
                    start: dDay + 'T' + hour + ':' + minute + ':00',
                    end: dDay + 'T' + hour + ':' + minute + ':00',
                    id: 'non_user',
                    title: name + '님 매입신청' + ' 방문(비회원)',
                };

                db.collection('showWork')
                    .doc('calendar')
                    .update({
                        request: firebase.firestore.FieldValue.arrayUnion(
                            calendar_item
                        ),
                    });
                db.collection('orders')
                    .doc('non_user')
                    .update({
                        orders: firebase.firestore.FieldValue.arrayUnion(
                            BOrders
                        ),
                    });
                db.collection('user')
                    .doc('non_user')
                    .update({
                        orders: firebase.firestore.FieldValue.arrayUnion(
                            BOrders
                        ),
                        count: firebase.firestore.FieldValue.increment(1),
                    });
                setDone(true);
                history.push('/');
                alert('비회원  직접방문 수거신청이 완료되었습니다.');
            }
        }
    };

    //Lodaing
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [QRRead, setQRRead] = useState<boolean>(false);
    const [uid, setUid] = useState<string>('');
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState('국민은행');

    //나중에  DB  구성할것들
    const [cate, setCate] = React.useState(101);
    const [store, setStore] = React.useState(1020);
    const [way, setWay] = React.useState(11);
    const [name, setName] = React.useState();
    const [tel, setTel] = React.useState();
    const [accountNumber, setAccountNumber] = React.useState();
    const [dDay, setDDay] = React.useState<any>();
    const [address, setAddress] = React.useState();
    const [additional, setAdditional] = React.useState('');
    const [PIDformatTEL, setPIDformatTEL] = React.useState();

    const [realWay, setRealWay] = React.useState<any>();

    //ways to 신청
    // const [ways,setWays] = useState([]);
    // const [choices,setChoices] = useState([]);
    // const [stores,setStores] = useState([]);

    //작성 완료 표기
    const [filled, setFilled] = React.useState(false);
    //modal
    const [done, setDone] = React.useState(false);
    //무게 추가
    const [addWeights, setAddWeights] = React.useState(false);
    //개인정보 확인
    const [consentAgreement1, setConsentAgreement1] = useState(false);
    const [consentModal, setConsentModal] = useState(false);

    //날짜 뽑기
    var today = new Date(),
        date =
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '/' +
            today.getDate();
    //날짜
    const [time, setTime] = React.useState();

    //시간 9-13 시 30분 단위 variable
    const [timeRangeHours, setTimeRangeHours] = useState([]);
    const [timeRangeMinutes, setTimeRangeMinutes] = useState([]);
    const [hour, setHour] = useState('09');
    const [minute, setMinute] = useState('00');
    const [answer, setAnswer] = useState(0);
    useEffect(() => {
        if (uid !== '') {
            const timeStamp = Date.now();
            var hourz = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: undefined,
                minute: undefined,
                second: undefined,
            }).format(timeStamp);

            var day =
                hourz.slice(-4) +
                '-' +
                hourz.slice(0, 2) +
                '-' +
                hourz.slice(3, 5);

            const min = new Intl.DateTimeFormat('en-US', {
                year: undefined,
                month: undefined,
                day: undefined,
                hour: '2-digit',
                minute: '2-digit',
                second: undefined,
            }).format(timeStamp);
            db.collection('user')
                .doc(uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        setAddress(doc.data()!.address);
                        setTel(doc.data()!.phone);
                        setName(doc.data()!.name);
                        setDDay(day);
                        setWay(11);
                        setCate(102);
                        setStore(1020);
                        setHour(min.slice(0, 2));
                        setMinute(min.slice(3, 5));
                        if (doc.data()!.accountNumber) {
                            setAccountNumber(doc.data()!.accountNumber);
                            setSelectedBank(doc.data()!.bank_type);
                        }
                        // setDDay()
                    } else {
                        alert(
                            '정보를 찾지 못했습니다. 다시확인해주시고 시도해주세요.'
                        );
                        setQRRead(true);
                        // doc.data() will be undefined in this case
                    }
                });
        }
    }, [uid]);
    useEffect(() => {
        if (db) {
            db.collection('infos')
                .doc('time')
                .get()
                .then((doc) => {
                    setTimeRangeHours(doc.data()!.hours);
                    setTimeRangeMinutes(doc.data()!.minutes);
                });
            db.collection('infos')
                .doc('banks')
                .get()
                .then((doc) => {
                    setBanks(doc.data()!.korea);
                });
            // db.collection('infos')
            // .doc('ways')
            // .get()
            // .then((doc) => {
            //     setWays(doc.data()!.ways);
            //     setChoices(doc.data()!.minutes);
            //     setStores(doc.data()!.stores);
            // });
        }
    }, []);

    //Search Options needed by 성함, 전화번호****
    const goBack = () => {
        history.push('/');
    };

    const sendInfo = (props: string) => {
        setUid(props);
        setQRRead(false);
    };

    const handleChange4 = (event: any) => {
        setWay(event.target.value);
        setCate(101);
    };
    const handleChange5 = (event: any) => {
        setCate(event.target.value);
    };
    const handleChange6 = (event: any) => {
        setStore(event.target.value);
    };
    const handleChange = (prop: string) => (event: any) => {
        if (prop === 'name_') {
            setName(event.target.value);
        } else if (prop === 'address_') {
            setAddress(event.target.value);
        } else if (prop === 'bank_acc_') {
            setSelectedBank(event.target.value);
        } else if (prop === 'accountNumber_') {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            setAccountNumber(onlyNums);
        } else if (prop === 'tel_') {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length < 11) {
                setTel(onlyNums);
            } else if (onlyNums.length === 11) {
                setPIDformatTEL(onlyNums);
                const number = onlyNums.replace(
                    /(\d{3})(\d{4})(\d{4})/,
                    '($1) $2-$3'
                );
                setTel(number);
            }
        } else if (prop === 'Dday_') {
            const year = event.target.value.toString().slice(0, 4);
            const month = event.target.value.toString().slice(5, 7);
            const day = event.target.value.toString().slice(8, 11);
            const check: number = day_of_week(
                Number(year),
                Number(month),
                Number(day)
            );
            setAnswer(check);
            // if (0 < check && check <= 5 && uid !== '') {
                if (uid) {
                    db.collection('user')
                        .doc(uid)
                        .get()
                        .then((doc) => {
                            if (doc.exists) {
                                var finding = doc.data()!.orders;
                                finding.forEach((orders: any) => {
                                    if (orders.date === event.target.value) {
                                        setDDay('yyyy-MM-dd');
                                        alert(
                                            '정하신 날짜에 이미 판매 신청이 존재합니다. 다른날로 정해주세요.'
                                        );
                                        return;
                                    }
                                });
                            }
                        });
                    setDDay(event.target.value);
                }
                setDDay(event.target.value);
            // } else if (0 < check && check <= 5 && uid === '') {
                // setDDay(event.target.value);
            // }
        } else if (prop === 'time_') {
            setTime(event.target.value);
        } else if (prop === 'time_H') {
            setHour(event.target.value);
        } else if (prop === 'time_M') {
            setMinute(event.target.value);
        } else if (prop === 'additional_') {
            setAdditional(event.target.value);
        } else if (prop === 'consent_1') {
            setConsentAgreement1(!consentAgreement1);
        }
    };

    // find weekday
    const day_of_week = (year: number, month: number, day: number) => {
        const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
        if (month < 3) year -= 1;
        return (
            (year +
                Math.floor(Number(year / 4)) -
                Math.floor(Number(year / 100)) +
                Math.floor(Number(year / 400)) +
                t[month - 1] +
                Math.floor(Number(day))) %
            7
        );
    };

    const refresh = () => {
        setDDay(undefined);
        setTime(undefined);
    };

    function toggleIsOn() {
        setAddWeights(!addWeights);
    }
    function onOff() {
        setConsentModal(!consentModal);
        if (consentModal === false) {
            rootElement.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }

    const GreenCheckbox = withStyles({
        root: {
            zIndex: 0,
            color: green[400],
            '&$checked': {
                color: green[600],
                zIndex: 0,
            },
        },
        checked: {},
    })((props: CheckboxProps) => <Checkbox color="default" {...props} />);

    var rootElement = document.documentElement;
    function scrollToTop() {
        // Scroll to top logic
        refresh();
        rootElement.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    return (
        <div style={{ width: '90%', margin: 'auto' }}>
            <FormControl style={{ width: '100%' }}>
                <div
                    style={{ justifyContent: 'center', textAlign: 'center' }}
                    // onClick={}
                >
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                            onClick={() => setQRRead(!QRRead)}
                            style={{
                                border: 'solid 3px',
                                margin: 'auto',
                                position: 'relative',
                                display: 'flex',
                                color: 'black',
                            }}
                        >
                            <QrCodeScannerIcon fontSize="large" />
                        </div>
                        {QRRead ? (
                            <BarcodeScannerComponent
                                facingMode={'environment'}
                                width={'50%'}
                                height={'100%'}
                                onUpdate={(err, result) => {
                                    if (result) sendInfo(result.getText());
                                }}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <TextField
                    style={{ top: '8px', marginBottom: '25px' }}
                    id="input-with-icon-TextField"
                    label="이름"
                    type="input"
                    disabled={done}
                    InputLabelProps={{
                        style: {
                            fontSize: '25px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        },
                    }}
                    InputProps={{
                        style: {
                            fontSize: '16px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            padding: '10px 0 0 0',
                        },
                        startAdornment: (
                            <InputAdornment position="start"></InputAdornment>
                        ),
                    }}
                    value={name}
                    placeholder="(ex) 홍길동"
                    onChange={handleChange('name_')}
                />
                <TextField
                    style={{ top: '8px', marginBottom: '25px' }}
                    id="input-with-icon-TextField"
                    label="주소"
                    type="input"
                    disabled={done}
                    placeholder="(ex) 경기도 고양시 일산동구 중산로 147 1층"
                    InputLabelProps={{
                        style: {
                            fontSize: '25px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        },
                    }}
                    InputProps={{
                        style: {
                            fontSize: '16px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            padding: '10px 0 0 0',
                        },
                        startAdornment: (
                            <InputAdornment position="start"></InputAdornment>
                        ),
                    }}
                    value={address}
                    onChange={handleChange('address_')}
                />
                <TextField
                    style={{ top: '8px', marginBottom: '25px' }}
                    id="input-with-icon-TextField"
                    label="전화번호"
                    type="input"
                    disabled={done}
                    InputLabelProps={{
                        style: {
                            fontSize: '25px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        },
                    }}
                    InputProps={{
                        style: {
                            fontSize: '16px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            padding: '10px 0 0 0',
                        },
                        startAdornment: (
                            <InputAdornment position="start"></InputAdornment>
                        ),
                    }}
                    placeholder="(000) 000 - 000"
                    value={tel}
                    onChange={handleChange('tel_')}
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div style={{ width: '30%' }}>
                        <div
                            style={{
                                textAlign: 'left',
                                color: 'rgba(0, 0, 0, 0.54)',
                                marginTop: '6px',
                            }}
                        >
                            은행
                        </div>
                        <div
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                textAlign: 'center',
                                width: '100%',
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        top: '-3px',
                                        position: 'relative',
                                    }}
                                >
                                    <Select
                                        label="시간"
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        value={selectedBank}
                                        onChange={handleChange('bank_acc_')}
                                        input={<BootstrapInput />}
                                    >
                                        {banks!.map((key) => {
                                            return (
                                                <MenuItem value={key}>
                                                    {key}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <TextField
                            style={{ top: '8px', marginBottom: '25px' }}
                            id="input-with-icon-TextField"
                            label="계좌번호"
                            type="input"
                            disabled={done}
                            InputLabelProps={{
                                style: {
                                    fontSize: '25px',
                                    fontFamily: 'TmoneyRoundWindExtraBold',
                                },
                            }}
                            InputProps={{
                                style: {
                                    fontSize: '16px',
                                    fontFamily: 'TmoneyRoundWindExtraBold',
                                    padding: '10px 0 0 0',
                                },
                                startAdornment: (
                                    <InputAdornment position="start"></InputAdornment>
                                ),
                            }}
                            placeholder="xxx-xxxx-xxxx"
                            value={accountNumber}
                            onChange={handleChange('accountNumber_')}
                        />
                    </div>
                </div>
                <TextField
                    style={{ top: '8px', marginBottom: '25px' }}
                    id="date"
                    label="방문일자"
                    // placeholder="평일만 설정해 주세요 (기능 개발중에 있습니다)"
                    type="date"
                    value={dDay}
                    disabled={done}
                    InputLabelProps={{
                        shrink: true,
                        style: {
                            fontSize: '25px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        },
                    }}
                    onChange={handleChange('Dday_')}
                    InputProps={{
                        style: {
                            fontSize: '16px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            padding: '10px 0 0 0',
                        },
                    }}
                />
                {uid === '' ? (
                    <>
                        <div
                            style={{
                                textAlign: 'left',
                                color: 'rgba(0, 0, 0, 0.54)',
                            }}
                        >
                            방문시간
                        </div>
                        <div
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                textAlign: 'center',

                                borderBottom: 'solid 1px rgba(0, 0, 0, 0.54)',
                                padding: '10px 0',
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <div style={{ margin: 'auto' }}>
                                    <Select
                                        label="시간"
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        value={hour}
                                        onChange={handleChange('time_H')}
                                        input={<BootstrapInput />}
                                    >
                                        {timeRangeHours!.map((key) => {
                                            return (
                                                <MenuItem value={key}>
                                                    {key}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </div>
                                <div
                                    style={{
                                        fontSize: '16px',
                                        fontFamily: 'TmoneyRoundWindExtraBold',
                                        color: 'black',
                                        margin: 'auto',
                                    }}
                                >
                                    시
                                </div>
                            </div>
                            <div style={{ margin: 'auto' }}>:</div>
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    flexDirection: 'row',
                                    display: 'flex',
                                }}
                            >
                                <div style={{ margin: 'auto' }}>
                                    <Select
                                        label="분"
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        value={minute}
                                        onChange={handleChange('time_M')}
                                        input={<BootstrapInput />}
                                    >
                                        {timeRangeMinutes!.map((key) => {
                                            return (
                                                <MenuItem value={key}>
                                                    {key}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </div>
                                <div
                                    style={{
                                        fontSize: '16px',
                                        fontFamily: 'TmoneyRoundWindExtraBold',
                                        color: 'black',
                                        margin: 'auto',
                                    }}
                                >
                                    분
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                {/* <TextField
                    style={{ top: '8px', marginBottom: '25px' }}
                    id="time"
                    label="희망시간 (9시 - 13시)"
                    placeholder="9 시 ~ 13시, 30분단위 로 설정해주세요 (기능 개발중에 있습니다)"
                    type="time"
                    disabled={done}
                    value={time}
                    InputLabelProps={{
                        shrink: true,
                        style: {
                            fontSize: '25px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        },
                    }}
                    inputProps={{
                        style: {
                            fontSize: '16px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            padding: '10px 0 0 0',
                        },
                        step: 1800,
                    }}
                    onChange={handleChange('time_')}
                /> */}
                <TextField
                    style={{ top: '8px', marginBottom: '25px' }}
                    id="standard-select-condition"
                    select
                    label="선택1"
                    disabled={done}
                    value={way}
                    onChange={handleChange4}
                    InputProps={{
                        style: {
                            fontSize: '20px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            padding: '10px 0 0 0',
                        },
                    }}
                    InputLabelProps={{
                        style: {
                            fontSize: '25px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        },
                    }}
                >
                    {ways.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                {way === 11 ? (
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="standard-select-condition"
                        select
                        label="선택2"
                        disabled={done}
                        value={cate}
                        onChange={handleChange5}
                        InputProps={{
                            style: {
                                fontSize: '20px',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                                padding: '10px 0 0 0',
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            },
                        }}
                    >
                        {choices.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <></>
                )}
                {cate === 102 ? (
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="standard-select-condition"
                        select
                        label="매장"
                        disabled={done}
                        value={store}
                        onChange={handleChange6}
                        InputProps={{
                            style: {
                                fontSize: '16px',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                                padding: '10px 0 0 0',
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            },
                        }}
                    >
                        {stores.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <></>
                )}
                {/* <input type="file" accept="image/*" capture="environment"></input> */}
            </FormControl>
            <div
                className="buttons"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    paddingTop: '20px',
                }}
            >
                <div>
                    {!filled ? (
                        <Button
                            style={{
                                fontSize: '15px',
                                fontFamily: 'TmoneyRoundWindExtraBold',
                            }}
                            variant="outlined"
                            onClick={() => {
                                addInfo();
                            }}
                        >
                            저장하기
                        </Button>
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                                flexDirection: 'row',
                            }}
                        >
                            <Button
                                style={{
                                    fontFamily: 'TmoneyRoundWindExtraBold',
                                }}
                                variant="outlined"
                                disabled
                            >
                                저장완료
                            </Button>
                            <Button
                                style={{
                                    fontFamily: 'TmoneyRoundWindExtraBold',
                                }}
                                variant="outlined"
                                onClick={() => {
                                    toggleIsOn();
                                }}
                            >
                                (준비중) 무게 추가하기
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: '20px 0 10px 0', fontSize: '10px' }}>
                <FormControlLabel
                    style={{ fontSize: '15px', color: 'black' }}
                    control={
                        <GreenCheckbox
                            checked={consentAgreement1}
                            disabled={done}
                            onChange={handleChange('consent_1')}
                            value={consentAgreement1}
                            name="radio-button-demo"
                            inputProps={{ 'aria-label': 'C' }}
                        />
                    }
                    label="개인정보처리방침 내용에 동의합니다."
                    labelPlacement="end"
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    fontSize: '20px',
                    width: '100%',
                }}
            >
                {done ? (
                    <Button
                        disabled={done}
                        className="buttons"
                        style={{
                            fontSize: '15px',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            width: '100%',
                        }}
                        variant="outlined"
                        onClick={() => {
                            calcMass();
                        }}
                    >
                        신청완료
                    </Button>
                ) : (
                    <Button
                        disabled={done}
                        className="buttons"
                        style={{
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            width: '100%',
                            fontSize: '15px',
                        }}
                        variant="outlined"
                        onClick={() => {
                            calcMass();
                        }}
                    >
                        신청하기
                    </Button>
                )}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    fontSize: '20px',
                    width: '100%',
                    padding: ' 10px 0 10px 0',
                }}
            >
                <Button
                    disabled={done}
                    className="buttons"
                    style={{
                        fontFamily: 'TmoneyRoundWindExtraBold',
                        width: '100%',
                        fontSize: '15px',
                    }}
                    variant="outlined"
                    onClick={() => goBack()}
                >
                    뒤로가기
                </Button>
            </div>
        </div>
    );
}

export default RequestOnSite;
