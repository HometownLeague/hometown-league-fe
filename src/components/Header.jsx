import React, { useEffect } from 'react'
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";


import useModals from './modal/useModal';
import {modals} from './modal/Modals';

import { Grid, Text, Image, Input } from "./elements";
import { history } from "../redux/configStore";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/userApi";
import NavHeader from "./NavHeader";


const Header = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const spanStyle = {
    lineHeight: "40px",
    color: "rgb(161, 161, 161)",
    fontSize: "13px",
    margin: "0 10px 0 5px",
  };
  const strongSt = {
    color: "rgb(239, 239, 239)",
    fontSize: "13px",
  };
  const liSt = {
    listStyle: "none",
    display: "inline-block",
    margin: "10px auto",
    height: "14px",
    fontSize: "12px",
    lineHeight: "14px",
    position: "relative",
    cursor: "pointer",
  };

  const { openModal } = useModals();

  const openLoginModal = () => {
    openModal(modals.loginModal, { onsubmit:(value)=>{console.log(value)}});
  };
  return (
    <Grid>
      <Grid padding="0 20px" width="1100px" margin="0 auto">
        <span style={spanStyle}>우리 동네</span>
        <strong style={strongSt}>|</strong>
        <span style={spanStyle}>리그를 한눈에</span>
        <ul
          style={{
            display: "inline-block",
            float: "right",
            margin: "0",
            padding: "0",
          }}
        >
           {/* <StyledLi>
          <LogoArea>
          <StyledLink to="/"><FontAwesomeIcon icon={faFutbol} size='2x'/></StyledLink>
        </LogoArea>
        </StyledLi> */}
          {user ? (
            <li style={liSt}>
              <StyledLink to='/'>
                {user.nickname}님
              </StyledLink>
              <span style={{ margin: "0 13px" }}>|</span>
            </li>
          ) : (
            <li style={liSt}>
              <StyledLink
                onClick={() => {
                  openLoginModal()
                }}
              >
                로그인
              </StyledLink>
              <span style={{ margin: "0 13px" }}>|</span>
            </li>
          )}
          {user ? (
            <>
             <li style={liSt}>
              <StyledLink 
                onClick={() => {
                  dispatch(userActions.logoutDB());
                }}
              >
                로그아웃
              </StyledLink>
              <span style={{ margin: "0 13px" }}>|</span>
            </li>
             <li style={liSt}>
             <StyledLink to='/myProfile'>마이페이지</StyledLink>
             <span style={{ margin: "0 13px" }}>|</span>
           </li>
            </> 
          ) : (
            <li style={liSt}>
              <StyledLink to='/join'>
                회원가입
              </StyledLink>
              <span style={{ margin: "0 13px" }}>|</span>
            </li>
          )}
   
          <li style={liSt}>
            <StyledLink
            >
              또 무언가
            </StyledLink>
            <span style={{ margin: "0 13px" }}>|</span>
          </li>
        </ul>
      </Grid>
      <Grid width="100%" height="50px" bg="rgb(250, 248, 248)">
        <NavHeader />
      </Grid>
    </Grid>
  );
};

export default Header;


const StyledLi = styled.li`
list-style: one;
position: relative;
display: inline-block;
height: 50px;
line-height: 50px;
text-aign: center;
font-size: 16px;
font-weight: bold, ;
`;
const StyledLink = styled(Link)`
cursor: pointer;
text-decoration: none;

`;
const LogoArea = styled.div`
width: 40px;
cursor: pointer;
height: 100%;
@media only screen and (max-width: 1024px) {
    margin-left: 26px;
}
`;