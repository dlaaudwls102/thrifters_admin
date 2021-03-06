import { FormControl, InputAdornment, TextField, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import { db } from '../../config/firebase';
import IPageProps from '../../interfaces/page';

const CustomerInfoPage: React.FunctionComponent<IPageProps> = (props:any) => {
    const [averageWeights, setAverageWeights] = useState<number>(0);
    const [numberOfOrders, setNumberOfOrders] = useState<string>('');
    const [totalAdditional, setTotalAdditional] = useState<string>('');
    const [totalWeights, setTotalWeights] = useState<string>('');
    const [error] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [Nname, setNName] = useState<string>('');
    const [address, setAddress] =useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [data] = useState<any>(props);
    const [editON] = useState<boolean>(false);
  
    const goBack = () =>{
       history.push('/')
    }

    const history = useHistory();
    
    useEffect(() => {
 
            db.collection('user').doc(data.location?.state!).get().then((doc)=>{
                if (doc.exists) {
                        setAddress(doc.data()!.address);
                        setPhone(doc.data()!.phone);
                        setName(doc.data()!.name);
                        setNName(doc.data()!.nickname);
                        var count:any = 0
                        for (var i = 0 ; i < doc.data()!.averageWeights.length; i++ ){
                            count = count + Number(doc.data()!.averageWeights[i])
                        }
                        var average = Math.round(Number(count)/doc.data()!.averageWeights.length);
                        setAverageWeights(average);
                        setNumberOfOrders(doc.data()!.numberOfOrders);
                        setTotalAdditional(doc.data()!.totalAdditional);
                        setTotalWeights(doc.data()!.totalWeight);
                }   
                else{
                    alert("???????????? ????????????." + " : " + data.location?.state )
                    console.log("data has been passed wrongly")
                    history.push('/QR_Reader')
                }
            })

    }, []);


    return (
        <div>
            <img className="img-logo-login" src="./thrifter_logo.png" alt=""></img>
            <div style={{ color:"black"}}>
                <FormControl style={{width:"100%"}} >
                        <TextField
                                autoComplete="new-password"
                                  name="confirm"
                                  id="confirm"
                                style = {{top:"2px", marginBottom:"25px", color:"black"}}
                                placeholder="????????? ??????????????????"
                                type="input"
                                value={name}
                                
                                label="??????"
                                disabled={!editON}
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
                                placeholder="????????? ??????????????????"
                                type="input"
                                value={Nname}
                      
                                label="??????"
                                disabled={!editON}
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
                                placeholder="????????? ??????????????????"
                                type="input"
                                value={address}
                                disabled={!editON}
                             
                                label="??????"
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
                                placeholder="??????????????? ??????????????????"
                                type="input"
                                value={phone}
                                disabled={!editON}
                               
                                label="????????????"
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
                                placeholder="??????????????? ??????????????????"
                                type="input"
                                value={totalWeights + " KG"}
                                disabled={!editON}
                               
                                label="??? ??????"
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
                                placeholder="??????????????? ??????????????????"
                                type="input"
                                value={totalAdditional + " ???"}
                                disabled={!editON}
                               
                                label="??? ????????????"
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
                                placeholder="??????????????? ??????????????????"
                                type="input"
                                value={averageWeights + " ???"}
                                disabled={!editON}
                               
                                label="????????????"
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
                                placeholder="??????????????? ??????????????????"
                                type="input"
                                value={numberOfOrders+ " ???"}
                                disabled={!editON}
                               
                                label="?????? ??????"
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
                                    <div>
                                    <Button
                                    disabled={editON}
                                        variant="outlined"
                                        onClick={() => goBack()}
                                        style={{width:"50%", margin:"auto"}}
                                    >
                                        ????????????
                                    </Button>
                                    </div>
                                    
                      <div style={{padding:"10px", fontFamily: 'TmoneyRoundWindExtraBold', color:"red"}}>
                    <ErrorText error={error} />
                    </div>
                </FormControl>
                </div>
        </div>
    );
}

export default CustomerInfoPage;