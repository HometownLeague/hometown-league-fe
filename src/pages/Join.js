import { useState } from "react";
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

const ErrorMessage = styled.h3`
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 12px;
  color: #eb4d4b;
  font-weight: bold;
`;

const Join = () => {
  //const history = useHistory();
  const [email, setEmail] = useState(""); // 유저 이메일
  const [password, setPassword] = useState(""); // 유저 비밀번호
  const [displayName, setDisplayName] = useState(""); // 유저 닉네임
  const [isAccount] = useState(false); // 계정 존재 여부 체크 (true: 계정있음, false: 계정없음)
  const [error, setError] = useState(null); // 로그인 또는 회원가입 에러메시지
  const [isRegisterForm, setIsRegisterForm] = useState(false); // 회원가입 폼


  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "emailInput") {
      setEmail(value);
    } else if (name === "passwordInput") {
      setPassword(value);
    } else if (name === "displayNameInput") {
      setDisplayName(value);
    }
  };

  // 이메일, 비밀번호로 계정 생성후 로그인
  const onClickRegister = async (event) => {
    event.preventDefault();

    try {
      if (!isAccount) {
        //TODO 서버에 넘겨주기
        setIsRegisterForm(!isRegisterForm);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
    }
  };

  return (
    <>
      <LoginFormContent>
        <LoginFormTag onSubmit={onClickRegister}>
          <LoginInputTag name="displayNameInput" type="text" placeholder="닉네임" onChange={onChange} value={displayName} required></LoginInputTag>
          <LoginInputTag name="emailInput" type="text" placeholder="이메일" onChange={onChange} value={email} required></LoginInputTag>
          <LoginInputTag name="passwordInput" type="password" placeholder="비밀번호" onChange={onChange} value={password} required></LoginInputTag>
          <ErrorMessage>{error && error}</ErrorMessage>
          <LoginSubmitTag type="submit" onClick={onClickRegister} value="회원가입"></LoginSubmitTag>
        </LoginFormTag>
      </LoginFormContent>
    </>
  )
};

export default Join;