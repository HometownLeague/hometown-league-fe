import { useState } from "react";
import ReactModal from 'react-modal';

import styled from "styled-components";

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

const LoginSubmitTag = styled.input`
  border: none;
  outline: none;
  background-color: #98cff8;
  padding: 12px;
  color: white;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: var(--twitter-color);
  }
`;
const LoginModal = ({onSubmit, onClose }) => {
     //const history = useHistory();
  const [email, setEmail] = useState(""); // 유저 이메일
  const [password, setPassword] = useState(""); // 유저 비밀번호
  const [isRegisterForm, setIsRegisterForm] = useState(false); // 회원가입 폼

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "emailInput") {
      setEmail(value);
    } else if (name === "passwordInput") {
      setPassword(value);
    }
  };

  // 이메일, 비밀번호로 계정 생성후 로그인
  const onClickRegister = async (event) => {
    event.preventDefault();

    try {
        //TODO 서버에 넘겨주기
        setIsRegisterForm(!isRegisterForm);
      
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
    const handleClickSubmit = () => {
      onSubmit();
    };

    const handleClickCancel = () => {
      onClose();
    };
  return (
    <ReactModal isOpen>
      <LoginFormContent>
        <LoginFormTag onSubmit={onClickRegister}>
          <LoginInputTag name="emailInput" type="text" placeholder="이메일" onChange={onChange} value={email} required></LoginInputTag>
          <LoginInputTag name="passwordInput" type="password" placeholder="비밀번호" onChange={onChange} value={password} required></LoginInputTag>
          <LoginSubmitTag type="submit" onClick={onClickRegister} value="로그인"></LoginSubmitTag>
        </LoginFormTag>
        <div>
        <button onClick={handleClickSubmit}>확인</button>
        <button onClick={handleClickCancel}>취소</button>
      </div>
      </LoginFormContent>
    </ReactModal>
  )
};

export default LoginModal;
