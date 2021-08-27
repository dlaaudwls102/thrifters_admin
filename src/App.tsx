import { relative } from 'path';
import React from 'react';
import './App.css';
import Application from './application';
import Videhome_ConfirmedOrder from './Videhome_confirmedOrder';
import Videhome_requests from './Videhome_requests';
import Videhome_CustomerList from './Videhome_customerList';


export interface UserState{
  user: {
    isAuthorized: boolean;
    isLoading: boolean;
  };
  page: number;

}

export default class App extends React.Component<{}, UserState>{
  constructor(props?: any, context?: any) {
    super(props, context);
    this.state = {
      user: {
        isAuthorized: false,
        isLoading: false,
      },
      page: 0
    }
  }
  public render(){

    const onClickHeaderBtn=(path : number)=>{
      this.setState({
        page: path,
      });
    }

   
    return(
    <>
    <div>
        <div className="topnav" id="myTopnav">
          <a id="0" onClick={onClickHeaderBtn.bind(this,0)} className={this.state.page == 0 ? "pressed" : ""}>로그인</a>
          <a id="1" onClick={onClickHeaderBtn.bind(this,1)} className={this.state.page == 1 ? "pressed" : ""}>신청확인</a>
          <a id="2" onClick={onClickHeaderBtn.bind(this,2)} className={this.state.page == 2 ? "pressed" : ""}>누적현황</a>
          <a id="3" onClick={onClickHeaderBtn.bind(this,3)} className={this.state.page == 3 ? "pressed" : ""}>고객명단</a>
          <a id="4" onClick={onClickHeaderBtn.bind(this,4)} className={this.state.page == 4 ? "pressed" : ""}>나의정보</a>
          {/* {(this.state.user.isAuthorized == false) ? <a className="right-text"><img className="img-top-icon" src="./videhome_icon.png"></img></a> : <div className="right-text">내 정보</div>} */}
        </div> 
        <div className="header_top">
            <img src="./videhome_header.png"></img>
          </div>
        <div className="App">
          {this.state.user.isLoading &&
            <div className="spinner-div">
            </div>
          }
        <div className="Body">
          {(this.state.page == 0)?<div style={{margin:"40px", position:"relative"}}><Application/></div>:<div/>}
          {(this.state.page == 1)?<Videhome_requests/>:<div/>}
          {(this.state.page == 2)?<Videhome_ConfirmedOrder/>:<div/>}
          {(this.state.page == 3)?<Videhome_CustomerList/>:<div/>}
          {/* {(this.state.page == 4)?<Direction/>:<div/>} */}
        </div>
        </div>
    </div>
    </>
  );
}
}
