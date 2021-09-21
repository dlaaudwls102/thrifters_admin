import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const TopNav = () => {

    const [page, setPage] = useState<Number | null>(0);
    const history = useHistory();

    const onClickHeaderBtn=(path : number, name : string)=>{
        setPage(path);
        history.push(name);
      }
    return(
      <div className="topnav" id="myTopnav">
      <a id="0" onClick={onClickHeaderBtn.bind(this,0, "/")} className={page == 0 ? "pressed" : ""}>로그인</a>
      <a id="1" onClick={onClickHeaderBtn.bind(this,1, "/requests")} className={page == 1 ? "pressed" : ""}>신청확인</a>
      <a id="2" onClick={onClickHeaderBtn.bind(this,2, "/finalize")} className={page == 2 ? "pressed" : ""}>매입현황</a>
      <a id="3" onClick={onClickHeaderBtn.bind(this,3, "/payment")} className={page == 3 ? "pressed" : ""}>송금현황</a>
      <a id="4" onClick={onClickHeaderBtn.bind(this,4, "/customer_list")} className={page == 4 ? "pressed" : ""}>고객명단</a>
    </div> 
    )


}

export default TopNav;