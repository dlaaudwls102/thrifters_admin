import { FormControl, InputAdornment, TextField, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import { db } from '../../config/firebase';
import IPageProps from '../../interfaces/page';

const CustomerInfoPage: React.FunctionComponent<IPageProps> = (props:any) => {
    const [email, setEmail] = useState<string>('');
    const [averageWeights, setAverageWeights] = useState<string>('');
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

    // const saveEdit = async () => {
    //     if(name !== undefined && address !== undefined && phone != undefined){

    //         auth.currentUser?.updateProfile({
    //             displayName: Nname,
               
    //         }).then(function() {
    //             console.log("Display name updated");
    //         }).catch(function(error) {
    //             console.error(error)
    //         });

            
    //         db.collection('user').doc(auth.currentUser?.email!).update({
                
    //                 userId: auth.currentUser?.email,
    //                 name: name,
    //                 address: address,
    //                 phone: phone,  
                
    //         });
    //         alert("수정이 완료되었습니다.")
    //         await delay(2000);
    //         history.push('/');
    //         }
    //     else{
    //         alert("작성완료후 눌러주세요.")

    //     }
    // }

//     const handleChange = (prop : string) => (event: any) => {


//   if (prop == "name_"){
//             setName(event.target.value)
//         }
//         else  if (prop == "Nname_"){
//             setNName(event.target.value)
//         }
//         else  if (prop == "address_"){
//             setAddress(event.target.value)
//         }
//         else  if (prop == "phone_"){
           
//             const onlyNums = event.target.value.replace(/[^0-9]/g, '');
//             if (onlyNums.length < 11) {
//                 setPhone(onlyNums)
//             } 
//             else if (onlyNums.length === 11) {
//                 const number = onlyNums.replace(
//                     /(\d{3})(\d{4})(\d{4})/,
//                     '($1) $2-$3'
//                 );
//                 setPhone(number)
//             }
//         }
//     }
    
    useEffect(() => {
 
            db.collection('user').doc(data.location?.state!).get().then((doc)=>{
                if (doc.exists) {
                        setAddress(doc.data()!.address);
                        setPhone(doc.data()!.phone);
                        setName(doc.data()!.name);
                        setNName(doc.data()!.nickname);
                        setAverageWeights(doc.data()!.averageWeights);
                        setEmail(doc.data()!.userId);
                        setNumberOfOrders(doc.data()!.numberOfOrders);
                        setTotalAdditional(doc.data()!.totalAdditional);
                        setTotalWeights(doc.data()!.totalWeights);
                }   
                else{
                    alert("존재하지 않습니다." + " : " + data.location?.state )
                    console.log("data has been passed wrongly")
                    history.push('/QR_Reader')
                }
            })

    }, []);


    return (
        <div>
            <img className="img-logo-login" src="./thrifter_logo.png"></img>
            <div style={{ color:"black"}}>
                <FormControl style={{width:"100%"}} >
                        <TextField
                                autoComplete="new-password"
                                  name="confirm"
                                  id="confirm"
                                style = {{top:"2px", marginBottom:"25px", color:"black"}}
                                placeholder="성함을 입력해주세요"
                                type="input"
                                value={name}
                                
                                label="성함"
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
                                placeholder="별명을 입력해주세요"
                                type="input"
                                value={Nname}
                      
                                label="별명"
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
                                placeholder="주소를 입력해주세요"
                                type="input"
                                value={address}
                                disabled={!editON}
                             
                                label="주소"
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
                                disabled={!editON}
                               
                                label="전화번호"
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
                                value={totalWeights + " KG"}
                                disabled={!editON}
                               
                                label="총 무게"
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
                                value={totalAdditional + " 원"}
                                disabled={!editON}
                               
                                label="총 추가금액"
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
                                value={averageWeights + " 원"}
                                disabled={!editON}
                               
                                label="평균금액"
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
                                value={numberOfOrders+ " 번"}
                                disabled={!editON}
                               
                                label="주문 횟수"
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
                                        뒤로가기
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