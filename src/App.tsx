import React from "react";
import "./App.css";
import Application from "./application";


export interface UserState {
  user: {
    isAuthorized: boolean;
    isLoading: boolean;
  };
  page: number;
}

export default class App extends React.Component<{}, UserState> {
  constructor(props?: any, context?: any) {
    super(props, context);
    this.state = {
      user: {
        isAuthorized: false,
        isLoading: false,
      },
      page: 0,
    };
  }
  public render() {

    return (
      <>
        <div>
          <div className="header_top">
            <img src="./videhome_header.png" alt=""/>
          </div>
          <div className="App">
            {this.state.user.isLoading && <div className="spinner-div"></div>}
            <div className="Body">
              <Application />
            </div>
          </div>
        </div>
      </>
    );
  }
}
