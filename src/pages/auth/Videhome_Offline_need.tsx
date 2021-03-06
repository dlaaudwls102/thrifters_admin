import React, { useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    InputAdornment,
    TextField,
} from '@material-ui/core';
import IPageProps from '../../interfaces/page';
import { auth, db } from '../../config/firebase';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';

const Need: React.FunctionComponent<IPageProps> = (props) => {
    const [name, setName] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [product, setProduct] = useState<string>();
    const [usage, setUsage] = useState<string>();
    const [price_range, setPriceRange] = useState<string>();
    const [color, setColor] = useState<string>();
    const [image, setImage] = useState<string>();
    const [etc, setEtc] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const history = useHistory();

    const delay = (ms: any) => new Promise((res: any) => setTimeout(res, ms));
    const sendNeed = async () => {
        if (
            name !== undefined &&
            phone !== undefined &&
            product !== undefined &&
            usage !== undefined &&
            price_range !== undefined &&
            color !== undefined &&
            etc !== undefined
        ) {
            const timeStamp = Date.now();
            var date = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: undefined,
                minute: undefined,
                second: undefined,
            }).format(timeStamp);
            date = date.slice(-4) + '/' + date.slice(0, 5);
            const hour = new Intl.DateTimeFormat('en-US', {
                year: undefined,
                month: undefined,
                day: undefined,
                hour: '2-digit',
                minute: '2-digit',
                second: undefined,
            }).format(timeStamp);

            const needs = {
                date: date,
                time: hour,
                userId: auth.currentUser?.email!,
                confirmed: '?????????',
                name: name,
                phone: phone,
                product: product,
                usage: usage,
                price_range: price_range,
                color: color,
                etc: etc,
                way:"??????",
                // image: image,
                uid: auth.currentUser?.uid!,
                timeStamp: new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }).format(timeStamp),
            };
            db.collection('totalClicks')
                .doc('need')
                .update({
                    applied: firebase.firestore.FieldValue.increment(1),
                });
            db.collection('needs')
                .doc('user')
                .update({
                    needs: firebase.firestore.FieldValue.arrayUnion(needs),
                });
            alert(
                '??????(????????????) ??????????????? ?????????????????????.'
            );
            setIsLoading(true);
            await delay(3000);
            setIsLoading(false);
            history.push('/');
        } else {
            alert('??? ??????????????? ??????????????????!');
        }
    };
    const goBack = () => {
        history.push('/');
    };
    const handleChange = (prop: string) => (event: any) => {
        if (prop === 'name_') {
            setName(event.target.value);
        } else if (prop === 'product_') {
            setProduct(event.target.value);
        } else if (prop === 'usage_') {
            setUsage(event.target.value);
        } else if (prop === 'price_range_') {
            setPriceRange(event.target.value);
        } else if (prop === 'color_') {
            setColor(event.target.value);
        } else if (prop === 'etc_') {
            setEtc(event.target.value);
        } else if (prop === 'image_') {
            setImage(event.target.value);
        } else if (prop == 'phone_') {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length < 11) {
                setPhone(onlyNums);
            } else if (onlyNums.length === 11) {
                const number = onlyNums.replace(
                    /(\d{3})(\d{4})(\d{4})/,
                    '($1) $2-$3'
                );
                setPhone(number);
            }
        }
    };
    return (
        <div id="pot">
            {isLoading && (
                <div className="loader-wrapper" style={{ position: 'fixed' }}>
                    <span className="loader">
                        <span className="loader-innder"></span>
                    </span>
                    <span className="loader_text">
                        {' '}
                        ???????????? ??????????????????..
                    </span>
                </div>
            )}
            <div
                style={{
                    fontFamily: 'Pretendard-Light',
                    fontSize: '20px',
                    color: 'black',
                    width: '100%',
                    justifyContent: 'center',
                    margin: '35px 0 10px 0',
                }}
                id="pot2"
            >
                <div
                    style={{
                        padding: '30px',
                        color: 'rgb(29, 121, 85)',
                        fontWeight: 600,
                        fontSize: '25px',
                    }}
                >
                    ????????????
                </div>
            </div>
            <div>
                <FormControl style={{ width: '90%' }}>
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="input-with-icon-TextField"
                        label="??????"
                        type="input"
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'Pretendard-Light',
                            },
                        }}
                        InputProps={{
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Pretendard-Light',
                                padding: '10px 0 0 0',
                            },
                            startAdornment: (
                                <InputAdornment position="start"></InputAdornment>
                            ),
                        }}
                        value={name}
                        placeholder="(ex) ?????????"
                        onChange={handleChange('name_')}
                    />
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="input-with-icon-TextField"
                        label="????????????"
                        type="input"
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'Pretendard-Light',
                            },
                        }}
                        InputProps={{
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Pretendard-Light',
                                padding: '10px 0 0 0',
                            },
                            startAdornment: (
                                <InputAdornment position="start"></InputAdornment>
                            ),
                        }}
                        value={phone}
                        placeholder="(ex) ?????????"
                        onChange={handleChange('phone_')}
                    />
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="input-with-icon-TextField"
                        label="??????"
                        type="input"
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'Pretendard-Light',
                            },
                        }}
                        InputProps={{
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Pretendard-Light',
                                padding: '10px 0 0 0',
                            },
                            startAdornment: (
                                <InputAdornment position="start"></InputAdornment>
                            ),
                        }}
                        value={product}
                        placeholder="(ex) ????????????"
                        onChange={handleChange('product_')}
                    />
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="input-with-icon-TextField"
                        label="??????"
                        type="input"
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'Pretendard-Light',
                            },
                        }}
                        InputProps={{
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Pretendard-Light',
                                padding: '10px 0 0 0',
                            },
                            startAdornment: (
                                <InputAdornment position="start"></InputAdornment>
                            ),
                        }}
                        value={usage}
                        placeholder="(ex) ?????????"
                        onChange={handleChange('usage_')}
                    />
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="input-with-icon-TextField"
                        label="?????????"
                        type="input"
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'Pretendard-Light',
                            },
                        }}
                        InputProps={{
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Pretendard-Light',
                                padding: '10px 0 0 0',
                            },
                            startAdornment: (
                                <InputAdornment position="start"></InputAdornment>
                            ),
                        }}
                        value={price_range}
                        placeholder="(ex) 1?????? ???"
                        onChange={handleChange('price_range_')}
                    />
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="input-with-icon-TextField"
                        label="??????"
                        type="input"
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'Pretendard-Light',
                            },
                        }}
                        InputProps={{
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Pretendard-Light',
                                padding: '10px 0 0 0',
                            },
                            startAdornment: (
                                <InputAdornment position="start"></InputAdornment>
                            ),
                        }}
                        value={color}
                        placeholder="(ex) ??????"
                        onChange={handleChange('color_')}
                    />
                    <TextField
                        style={{ top: '8px', marginBottom: '25px' }}
                        id="input-with-icon-TextField"
                        label="????????????"
                        type="input"
                        InputLabelProps={{
                            style: {
                                fontSize: '25px',
                                fontFamily: 'Pretendard-Light',
                            },
                        }}
                        InputProps={{
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Pretendard-Light',
                                padding: '10px 0 0 0',
                            },
                            startAdornment: (
                                <InputAdornment position="start"></InputAdornment>
                            ),
                        }}
                        value={etc}
                        placeholder="(ex) ??????"
                        onChange={handleChange('etc_')}
                    />
                    {/* <div style={{ width: '100%', padding: '30px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                        ></input>
                    </div> */}
                </FormControl>
            </div>
            <div style={{ padding: '0px 0px 20px 0px' }}>
                <Button
                    variant="outlined"
                    onClick={() => goBack()}
                    style={{
                        width: '40%',

                        minWidth: '30px',
                        margin: '10px',
                        fontFamily: 'Pretendard-Light',
                    }}
                >
                    ????????????
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => sendNeed()}
                    style={{
                        width: '40%',

                        minWidth: '30px',
                        margin: '10px',
                        fontFamily: 'Pretendard-Light',
                    }}
                >
                    ????????????
                </Button>
            </div>
        </div>
    );
};
export default Need;
