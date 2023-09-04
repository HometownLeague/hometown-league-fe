import React,{ useState } from "react";
import ReactModal from 'react-modal';
import Swal from "sweetalert2";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { actionCreators as userAction } from "../../redux/userApi";

const LoginModal = ({onSubmit, onClose }) => {
  const dispatch = useDispatch();
  const [id, setId] = React.useState("");//유저 아이디
    const [password, setPassword] = useState(""); // 유저 비밀번호

    //모달 열기 닫기 함수
    const handleClickSubmit = (e) => {
      e.preventDefault()
      login();
      onClose();
    };

    const handleClickCancel = () => {
      onClose();
    };
    const emailCheck = (email) =>{
      let _reg = /^[0-9a-zA-Z]([-_.0-9a-zA-Z])*@[0-9a-zA-Z]([-_.0-9a-zA-Z])*.([a-zA-Z])*/;
  
      return _reg.test(email); 
  }
    //로그인 API
    const login = () => {
      if (id === "" || password === "") {
        Swal.fire({
          text: "정보를 입력해주세요.",
          confirmButtonColor: "#E3344E",
        })
        return;
      }
      else if (!emailCheck(id)) {
        Swal.fire({
          text: "올바른 이메일 형식이 아닙니다.",
          confirmButtonColor: "#E3344E",
        })
        return;
      }else{
        dispatch(userAction.loginDB(id, password));
      }
    };

  return (
    <ReactModal isOpen>
      <LoginFormContent>
        <LoginFormTag onSubmit={handleClickSubmit}>
          <LoginInputTag name="emailInput" type="text" placeholder="이메일" onChange={e=>setId(e.target.value)} value={id} required></LoginInputTag>
          <LoginInputTag name="passwordInput" type="password" placeholder="비밀번호" onChange={e=>setPassword(e.target.value)} value={password} required></LoginInputTag>
          <div>
            <LoginSubmitTag type="submit">로그인</LoginSubmitTag>
            <CancelBtn type="button" onClick={handleClickCancel}>취소</CancelBtn> 
          </div>
        </LoginFormTag>
      </LoginFormContent>
    </ReactModal>
  )
};

export default LoginModal;


const LoginFormContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  padding-top: 45px;
`;


const LoginFormTag = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const LoginInputTag = styled.input`
  border: none;
  outline: none;
  padding: 15px;
  padding-bottom: 15px;
  padding-top: 27px;
  background-color: #f5f5f5;
  margin-top: 10px;
  font-size: 16px;
  border-radius: 5px;
  position: relative;

  &:focus {
    background-color: #e8e8e8;
  }

  &::placeholder {
    font-size: 14px;
    position: absolute;
    top: 10px;
    left: 15px;
  }
`;

const LoginSubmitTag = styled.button`
  border: none;
  outline: none;
  padding: 12px;
  color: black;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #D0BFFF;
  }
`;
const CancelBtn = styled.button`
  border: none;
  outline: none;
  padding: 12px;
  color: black;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #D0BFFF;
  }
`;