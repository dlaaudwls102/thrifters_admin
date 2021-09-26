import { Button, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth} from "../config/firebase";
import IPageProps from "../interfaces/page";

const useStyles = makeStyles({
  flexGrow: {
    flex: "1",
  },
  button: {
    fontSize: "13px",
    backgroundColor: "#fff",
    borderRadius: "1rem",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#FBAA13",
      color: "#07381B",
    },
  },
});

const HomePage: React.FunctionComponent<IPageProps> = (props) => {
  const [username, setUsername] = useState(auth.currentUser?.displayName);
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

  const saveUserName = (name: string) => {
    auth.currentUser
      ?.updateProfile({
        displayName: name,
      })
      .then(function () {
        console.log("Display name updated");
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
          <img className="img-logo" src="./thrifter_logo.png" alt=""/>
        </div>
      </div>

      {!dispSetDone ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ color: "black", fontFamily: "TmoneyRoundWindExtraBold" }}
          >
            <p>환영합니다, 별명을 설정해 주세요</p>
          </div>
          <div style={{ width: "100%", position: "relative" }}>
            <TextField
              style={{ top: "2px", marginBottom: "25px", color: "black" }}
              id="input-with-icon-textfield"
              placeholder="별명을 설정주세요"
              type="text"
              autoComplete="current-password"
              onChange={(event) => setUsername(event.target.value)}
              label="별명"
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "19px",
                  color: "black",
                },
                "aria-label": "naked",
              }}
              InputLabelProps={{
                style: {
                  fontSize: "15px",
                  fontFamily: "TmoneyRoundWindExtraBold",
                },
              }}
            />
            <div>
              <Button
                variant="outlined"
                onClick={() => {
                  saveUserName(username!);
                }}
                style={{ width: "50%", margin: "auto" }}
              >
                저장하기
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="pot"
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{ color: "black", fontFamily: "TmoneyRoundWindExtraBold" }}
          >
            <p>안녕하세요, {username} 님</p>
          </div>
          <div id="pot" style={{ padding: "0 0 20px 0" }}>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={() => {
                history.push("/calendar");
              }}
              style={{
                width: "65%",
                padding: "10px",
                margin: "auto",
                border: "solid 2px",
                borderRadius: "10rem",
                color: "black",
                fontFamily: "TmoneyRoundWindExtraBold",
              }}
            >
              나의 일정
            </Button>
          </div>
          <div id="pot" style={{ padding: "0 0 20px 0" }}>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={() => {
                history.push("/requests");
              }}
              style={{
                width: "65%",
                padding: "10px",
                margin: "auto",
                border: "solid 2px",
                borderRadius: "10rem",
                color: "black",
                fontFamily: "TmoneyRoundWindExtraBold",
              }}
            >
              신청 확인
            </Button>
          </div>
          <div id="pot" style={{ padding: "0 0 20px 0" }}>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={() => {
                history.push("/finalize");
              }}
              style={{
                width: "65%",
                padding: "10px",
                margin: "auto",
                border: "solid 2px",
                borderRadius: "10rem",
                color: "black",
                fontFamily: "TmoneyRoundWindExtraBold",
              }}
            >
              매입 정산
            </Button>
          </div>
          <div id="pot" style={{ padding: "0 0 20px 0" }}>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={() => {
                history.push("/payment");
              }}
              style={{
                width: "65%",
                padding: "10px",
                margin: "auto",
                border: "solid 2px",
                borderRadius: "10rem",
                color: "black",
                fontFamily: "TmoneyRoundWindExtraBold",
              }}
            >
              송금 확인
            </Button>
          </div>
          <div id="pot" style={{ padding: "0 0 20px 0" }}>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={() => {
                history.push("/QR_Reader");
              }}
              style={{
                width: "65%",
                padding: "10px",
                margin: "auto",
                border: "solid 2px",
                borderRadius: "10rem",
                color: "black",
                fontFamily: "TmoneyRoundWindExtraBold",
              }}
            >
              QR 스캔
            </Button>
          </div>
          <div id="pot" style={{ padding: "0 0 20px 0" }}>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={() => {
                history.push("/logout");
              }}
              style={{
                width: "65%",
                padding: "10px",
                margin: "auto",
                border: "solid 2px",
                borderRadius: "10rem",
                color: "black",
                fontFamily: "TmoneyRoundWindExtraBold",
              }}
            >
              로그아웃
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
