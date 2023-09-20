import React, { useEffect } from 'react'
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { Text } from './elements';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faFutbol} from "@fortawesome/free-solid-svg-icons";

import useModals from './modal/useModal';
import {modals} from './modal/Modals';

import { actionCreators as userAction } from '../redux/userApi';
function Header() {
  const dispatch=useDispatch();
  const user = useSelector((state) => state.user.user);
  //const isLoading = useSelector((state) => state.user.userLoading);
  const loginToken=localStorage.getItem('loginToken');
  const { openModal } = useModals();

  const openLoginModal = () => {
    openModal(modals.loginModal, { onsubmit:(value)=>{console.log(value)}});
  };

  return (
    <>
    <Container>
      <StyledUl>
        <StyledLi>
          <LogoArea>
          <StyledLink to="/"><FontAwesomeIcon icon={faFutbol} size='2x'/></StyledLink>
        </LogoArea>
        </StyledLi>
        <StyledLi>
        <StyledLink to="/teamManagement">팀 관리</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/matching">매칭</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/">이적 시장</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/">커뮤니티</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/">랭킹</StyledLink>
        </StyledLi>
        {loginToken&&user? (  
        <UserContainer>
        <UserInfo>
          {/* //TODO - user image 연결 */}
          {/* {user.image ? (
          <>
            <UserImg src={user.photoURL} />
            <LoginArea onClick={()=>{dispatch(userAction.logoutDB())}}>로그아웃</LoginArea>
            
          </>
          
          ) : ( */}
          <>
            {/* <FontAwesomeIcon icon={faUser} /><Text>{user.nickname}</Text> */}
            <LoginArea onClick={()=>{dispatch(userAction.logoutDB())}}>로그아웃</LoginArea>
          </>
          {/* )} */}
        </UserInfo>
      </UserContainer>
      ) : (

        <StyledLi>
            <LoginArea onClick={openLoginModal}>로그인</LoginArea>
            <StyledLink to="/join">회원가입</StyledLink>
          </StyledLi>
          
      )}
      </StyledUl>
    </Container>
    
    </>
  )
}
const Container= styled.div`
    max-width: 1004px;
    display: flex;
    justify-content: space-between;
    vertical-align: middle;
    align-items: center;
    margin: 0 auto;
`;

const LogoArea = styled.div`
    width: 40px;
    cursor: pointer;
    height: 100%;
    @media only screen and (max-width: 1024px) {
        margin-left: 26px;
    }
`;

const StyledLi = styled.li`
  list-style: none;
  display: inline-block;
  margin: 20px 30px;
  height: 14px;
  font-size: 12px;
  line-height: 9px;
  position: relative;
  cursor: pointer;
  align-items: center;
  
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  font-size: 20px;
  color:black;
`;

const StyledUl = styled.ul`
  listStyle : none;
  justify-content : space-between;
  width : 100vw;
`
const ProfileImg = styled.img`
    width: 30px;
    hegiht: 30px;
    object-fit: cover;
    border-radius: 40px;
    @media only screen and (max-width: 1024px) {
        margin-right: 26px;
    }
`;

const LoginArea = styled.button`
    font-size: 16px;
    font-weight: normal;
    cursor: pointer;
    height: 100%;
    margin: ${(props) => (props.is_user ? "-4px 12px 0 0" : "0")};
    @media only screen and (max-width: 1024px) {
        margin-right: ${(props) => (props.is_user ? "12px" : "26px")};
    }
`;

const UserContainer = styled.div``;
const UserInfo = styled.div`
  flex: 8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 12px;
`;
const UserName = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 5px;
`;
const UserImg = styled.img`
  flex: 1;
  width: 46px;
  height: 46px;
  border-radius: 50%;
`;

const ToggleLoginDiv =styled.div`
// display: flex; 
// position: absolute; 
// top: 50%; 
// left: 50%; 
// padding: 2rem; 
// background-color: #ffffff; 
// transform-origin: center; 
// --transform-translate-x: -50%; 
// --transform-translate-y: -50%; 
// flex-direction: column; 
// justify-content: flex-start; 
// align-items: flex-start; 
// width: 24rem; 
// height: auto; 
// border-radius: 1rem; 
// border-width: 1px; 
// border-color: #ffffff; 
// outline: 0; 
`
const LoginBtn=styled.button`
display: flex; 
padding-top: 0.75rem;
padding-bottom: 0.75rem; 
margin-bottom: 1rem; 
background-color: #C4B5FD; 
color: #ffffff; 
font-weight: 700; 
justify-content: center; 
align-items: center; 
width: 100%; 
border:none;
border-radius: 100px; 
cursor: pointer; 

`

export default Header