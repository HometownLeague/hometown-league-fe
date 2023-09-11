import React, { useCallback } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Space, Button, Input, Form } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { actionCreators as userAction } from "../redux/userApi";
// import { API_URL } from '../lib/constants'\
import useInput from '../components/useInput';

import useModals from '../components/modal/useModal';
import { modals } from '../components/modal/Modals';

const StyledForm = styled.div`
  max-width:100%;
  margin: 0 auto;
  text-align: center;
  padding: 10px;
  @media (min-width: 450px) {
    max-width:70%;
  }
  @media (min-width: 701px) {
    max-width: 300px;
  }
`;

const Join = () => {
  const [nickname, onChangeNickname] = useInput('');
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, onChangePasswordCheck] = useInput('');
  const [desc, onChangeDesc] = useInput('');

  //login modal 
  const { openModal } = useModals();
  const openLoginModal = () => {
    openModal(modals.loginModal, { onsubmit: (value) => { console.log(value) } });
  };

  // antd form control
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // 회원가입 요청
  const onsubmitForm = useCallback(({ email, nickname, password, desc }) => {
    const data = {
      id: email,
      nickname: nickname,
      password: password,
      description: desc,
    }
    dispatch(userAction.registerDB(data));

  }, []);

  // nickname 유효성 검사
  // length 2~20, english, korean, number
  const validateNickname = useCallback((_, value) => {
    if (!value) {
      return Promise.reject(new Error('닉네임은 필수 항목입니다.'));
    }
    if (/\s/.test(value)) {
      return Promise.reject(new Error('닉네임은 공백을 포함 할 수 없습니다.'));
    }
    let nicknameLength = 0;
    for (let i = 0; i < value.length; i += 1) {
      const char = value.charAt(i);
      if (escape(char).length > 4) {
        nicknameLength += 2;
      } else {
        nicknameLength += 1;
      }
    }
    if (nicknameLength < 2 || nicknameLength >= 20) {
      return Promise.reject(new Error('닉네임 한글1~10자, 영문 및 숫자 2~20자까지 입력가능합니다.'));
    }

    const regExp = /[^a-zA-Z0-9가-힣_]/;
    if (regExp.test(value)) {
      return Promise.reject(new Error('닉네임은 한글, 영문, 숫자, _ 만 사용할 수 있습니다.'));
    }
    return Promise.resolve();
  }, []);
  //FIXME - 중복 검사 안됌. 고치기
  // nickname 중복 검사
  const onCheckNickname = useCallback(() => {
    if (form.getFieldError('nickname').length === 0 && form.getFieldValue('nickname')) {
      axios({
        method: "get",
        url: `/user/is-duplicate?type=nickname&value=${form.getFieldValue('nickname')}`,
      })
        .then((response) => {
          console.log(response)
          if (response.data === "N") {
            form.setFields([{
              name: 'nickname',
              message: ['사용 가능한 닉네임입니다.']
            }]);
          } else {
            form.setFields([{
              name: 'nickname',
              errors: ['사용중인 닉네임 입니다.'],
            }]);
          }
        }).catch((e) => {
          console.error(e);
        });
    }
  }, []);

  // email 유효성 검사
  const validateEmail = useCallback((_, value) => {
    const regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (!value) {
      return Promise.reject(new Error('이메일은 필수 항목입니다.'));
    }
    if (!value.match(regExp)) {
      return Promise.reject(new Error('올바른 이메일 형식이 아닙니다.'));
    }
    return Promise.resolve();
  }, []);

  // email 중복 검사
  const onCheckEmail = useCallback(() => {
    if (form.getFieldError('email').length === 0 && form.getFieldValue('email')) {
      axios({
        method: "get",
        url: `/user/is-duplicate?type=id&value=${form.getFieldValue('email')}`,

      })
        .then((response) => {
          console.log(response)
          if (response.data === "N") {
            form.setFields([{
              name: 'email',
              message: ['사용 가능한 이메일입니다.']
            }]);
          } else {
            form.setFields([{
              name: 'email',
              errors: ['이미 가입된 이메일 입니다.'],
            }]);
          }
        }).catch((e) => {
          console.error(e);
        });
    }
  }, []);

  // password 유효성 검사
  const validatePassword = useCallback((_, value) => {
    const regExp = /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-z]{1,50})(?=.*[A-Z]{1,50}).{8,50}$/;
    if (!value) {
      return Promise.reject(new Error('비밀번호는 필수 항목입니다.'));
    }
    // if (!regExp.test(value)) {
    //   return Promise.reject(new Error('비밀번호는 8~50자이며 영문 소문자, 영문 대문자, 숫자, 특수문자를 모두 포함해야 합니다.'));
    // }
    return Promise.resolve();
  }, []);

  // passwordCheck 유효성 검사
  const validatePasswordCheck = useCallback((_, value) => {
    if (form.getFieldValue('password') && form.getFieldValue('password') !== value) {
      return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
    }
    return Promise.resolve();
  }, []);

  return (
    <StyledForm>
      <Space direction="vertical" style={{ width: '100%' }}>
        <h3>회원 가입</h3>
        <Form onFinish={onsubmitForm} form={form}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              style={{ marginBottom: 0 }}
              name="nickname"
              hasFeedback
              rules={[{ validator: validateNickname }]}
              direction='horizontal'
            >
              <Space.Compact>
                <Input
                  placeholder="닉네임"
                  value={nickname}
                  onChange={onChangeNickname}
                  allowClear
                />
                <Button onClick={onCheckNickname}>중복 체크</Button>
              </Space.Compact>

            </Form.Item>
            <Form.Item
              name="desc"
            >
              <Input.TextArea placeholder="자신의 소개글을 적어주세요"
                value={desc}
                onChange={onChangeDesc}
                maxLength={50} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 0 }}
              name="email"
              hasFeedback
              rules={[{ validator: validateEmail }]}
            >
              <Space.Compact>
                <Input
                  placeholder="이메일"
                  type="email"
                  value={email}
                  onChange={onChangeEmail}
                  allowClear
                />
                <Button onClick={onCheckEmail}>중복 체크</Button>
              </Space.Compact>

            </Form.Item>
            <Form.Item
              style={{ marginBottom: 0 }}
              name="password"
              hasFeedback
              rules={[{ validator: validatePassword }]}
            >
              <Input.Password
                placeholder="비밀번호"
                value={password}
                onChange={onChangePassword}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                allowClear
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 0 }}
              name="password-check"
              hasFeedback
              dependencies={['password']}
              rules={[{ validator: validatePasswordCheck }]}
            >
              <Input.Password
                placeholder="비밀번호 확인"
                value={passwordCheck}
                onChange={onChangePasswordCheck}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                allowClear
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>회원 가입</Button>
          </Space>
        </Form>
        <div>
          이미 가입하셨나요?
          <Button type="link" size={10} style={{ padding: '0 0 0 5px' }} onClick={openLoginModal}>로그인</Button>
        </div>
      </Space>
    </StyledForm>
  );
};

export default Join;