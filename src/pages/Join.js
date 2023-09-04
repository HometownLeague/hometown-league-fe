import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

import { actionCreators as userAction } from "../redux/userApi";
import { API_URL } from '../lib/constants'

const Join = () => {
  const dispatch = useDispatch();

  const [id, setId] = useState(""); // 유저 이메일
  const [verifiedId, setVerifiedId] = React.useState("");
  const [password, setPassword] = useState(""); // 유저 비밀번호
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isAccount] = useState(false); // 계정 존재 여부 체크 (true: 계정있음, false: 계정없음)
  const [error, setError] = useState(null); // 로그인 또는 회원가입 에러메시지

  //이메일 중복 검사 API
  const checkIdDup = (type, value) => {
    axios({
      method: "get",
      url: `${API_URL}/user/is-duplicate?type=${type}&value=${value}`,
      data: {
        type: type,
        value: value
      },
    })
      .then((response) => {
        if (response.data === "N") {
          setVerifiedId(id);
        } else {
          Swal.fire({
            text: "이미 존재합니다.",
            confirmButtonColor: "#E3344E",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          text: "잠시 후 다시 시도해주세요.",
          confirmButtonColor: "rgb(118, 118, 118)",
        });
      });

  }
  const inputGuide = () => {
    Swal.fire({
      text: "정보를 입력해주세요.",
      confirmButtonColor: "#E3344E",
    });
  };

  // 이메일, 비밀번호로 계정 생성후 로그인
  const onClickRegister = async (event) => {
    event.preventDefault();
    if (id !== verifiedId) {
      Swal.fire({
        text: "이메일 중복확인이 필요합니다.",
        confirmButtonColor: "#E3344E",
      });
    } else {
      dispatch(userAction.joinDB(verifiedId, confirmPassword));
    }
  };

  return (
    <Container>
      <LoginFormContent>
        <LoginFormTag onSubmit={onClickRegister}>
          <LoginInputTag name="idInput" type="text" placeholder="이메일" onChange={e => setId(e.target.value)} value={id} required></LoginInputTag>
          <button onClick={() => {
            checkIdDup("id", id);
          }}
          //disabled={!emailCheck(id) ? true : false}
          >
            {verifiedId && verifiedId === id ? (
              <React.Fragment>
                사용
                <br />
                가능
              </React.Fragment>
            ) : (
              <React.Fragment>
                중복
                <br />
                확인
              </React.Fragment>
            )}
          </button>
          <LoginInputTag name="passwordInput" type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} value={password} required></LoginInputTag>
          <LoginInputTag name="passwordInput" type="password" placeholder="비밀번호 재입력" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} required></LoginInputTag>

          {confirmPassword && password !== confirmPassword ? (
            <span color="#E2344E" size="11px" margin="0 10px">
              비밀번호가 일치하지 않습니다.
            </span>
          ) : (
            ""
          )}
          {verifiedId &&
            id.length > 2 &&
            password &&
            password === confirmPassword ? (
            <LoginSubmitTag type="submit" onClick={onClickRegister} value="회원가입"></LoginSubmitTag>

          ) : (
            <button onClick={inputGuide}
            >
              회원가입
            </button>
          )}

        </LoginFormTag>
      </LoginFormContent>
    </ Container>
  )
};

export default Join;
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  margin: auto;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
`;
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