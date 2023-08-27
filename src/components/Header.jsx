import React, { useEffect } from 'react'
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faFutbol} from "@fortawesome/free-solid-svg-icons";

import useModals from './modal/useModal';
import {modals} from './modal/Modals';

function Header() {

  const user = useSelector((state) => state.user.user);
  //const isLoading = useSelector((state) => state.user.userLoading);
  const { openModal } = useModals();

  const openLoginModal = () => {
    openModal(modals.loginModal, { });
  };

  useEffect(()=>{

  })
  return (
    <>
    <Container>
      <StyledUl>
        <LogoArea>
          <StyledLink to="/"><FontAwesomeIcon icon={faFutbol}/></StyledLink>
        </LogoArea>
        <StyledLi>
        <StyledLink to="/">팀 관리</StyledLink>
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
        {user? (  
        <UserContainer>
        <UserInfo>
          {user.photoURL ? (
            <UserImg src={user.photoURL} />
          ) : (
            <faUser/>
          )}
        </UserInfo>
      </UserContainer>
      ) : (
        <StyledLi>
            <button onClick={openLoginModal}>로그인</button>
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
    width: 180px;
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

const LoginArea = styled.span`
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