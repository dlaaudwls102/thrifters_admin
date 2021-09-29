import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../config/firebase';
import { Button, FormControl, TextField } from '@material-ui/core';

const Currency = () => {
    const [currencyList, setCurrencyList] = useState<any>({});
    const [listItems, setListItems] = useState<any>();
    const [onOff, setOnOff] = useState<boolean>(false);
    const translate: any = {
        books: '책',
        steel: '고철',
        non_steel: '비철',
        fashion: '패션',
        clothes: '의류',
        shoes: '신발',
        bags: '가방',
    };

    const history = useHistory();
    const delay = (ms: any) => new Promise((res: any) => setTimeout(res, ms));
    useEffect(() => {
        // db.collection("showWork").doc("calendar").update({
        //     request: events
        // })
        db.collection('infos')
            .doc('currency')
            .get()
            .then((doc) => {
                setListItems(
                    Object.keys(doc.data()!.calculate).map((key: any) => (
                        <>
                            <TextField
                                autoComplete="new-password"
                                name="confirm"
                                id="confirm"
                                style={{
                                    top: '2px',
                                    marginBottom: '25px',
                                    color: 'black',
                                }}
                                onChange={handleChange(key)}
                                placeholder={doc.data()!.calculate[key] + '원'}
                                type="number"
                                label={translate[key] + ' :'}
                                inputProps={{
                                    style: {
                                        textAlign: 'center',
                                        fontSize: '19px',
                                        fontFamily: 'Cafe24Oneprettynight',
                                    },
                                    'aria-label': 'naked',
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '15px',
                                        fontFamily: 'TmoneyRoundWindExtraBold',
                                    },
                                }}
                            ></TextField>
                            <div
                                style={{
                                    padding: '0',
                                    width: '100%',
                                    fontSize: '15px',
                                }}
                            >
                                {translate[key]} 현재 시세:{' '}
                                {doc.data()!.calculate[key]} 원{' '}
                            </div>
                        </>
                    ))
                );
                setCurrencyList(doc.data()!.calculate);
            });
    }, []);
    const handleChange = (prop: any) => (event: any) => {
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        if (onlyNums.length > 3) {
            alert('천원단위 이하로만 가능합니다.');
        } else {
            currencyList[prop] = Number(event.target.value);

            setCurrencyList(currencyList);
        }
    };
    const confirm = async () => {
        var confirmEdit = window.confirm('변경 하시겠습니까?');
        if (confirmEdit && currencyList !== {}) {
            db.collection('infos').doc('currency').update({
                calculate: currencyList,
            });
            setOnOff(true);
            await delay(200);
            alert('변경되었습니다.');
            await delay(500);
            setOnOff(false);
            history.push('/');
        }
    };
    return (
        <div
            style={{
                paddingTop: '50px',
                fontSize: '11px',
                color: 'black',
                height: '100%',
                width: '100%',
            }}
        >
            <div className="Apps">
                <img
                    id="pot"
                    className="img-announce"
                    src="../006.png"
                    alt=""
                ></img>
                {onOff ? (
                    <div
                        className="loader-wrapper"
                        style={{ position: 'fixed' }}
                    >
                        <span className="loader">
                            <span className="loader-innder"></span>
                        </span>
                        <span className="loader_text">
                            {' '}
                            변경사항 저장중입니다.{' '}
                        </span>
                    </div>
                ) : (
                    <></>
                )}

                <FormControl style={{ width: '70%' }}>
                    {listItems}
                    <Button
                        className="buttons"
                        style={{
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            padding: '4px',
                            width: '100%',
                            margin: '40px 0',
                        }}
                        variant="outlined"
                        onClick={() => {
                            confirm();
                        }}
                    >
                        변경 완료
                    </Button>
                </FormControl>
            </div>
        </div>
    );
};
export default Currency;
