import React,{ useState,useCallback } from "react";
import ReactModal from 'react-modal';
import styled from "styled-components";
import { LockOutlined, UserOutlined} from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

import { actionCreators as userAction } from "../../redux/userApi";
import useInput from '../useInput';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const LoginModal = ({onSubmit, onClose }) => {
  const dispatch = useDispatch();
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');

    const handleClickCancel = () => {
      onClose();
    };

    const emailCheck = (email) =>{
      let _reg = /^[0-9a-zA-Z]([-_.0-9a-zA-Z])*@[0-9a-zA-Z]([-_.0-9a-zA-Z])*.([a-zA-Z])*/;
  
      return _reg.test(email); 
  }
    //로그인 API
    const handleClickSubmit = useCallback(({id,password})=>{
      dispatch(userAction.loginDB(id, password));
      onClose();
    },[]);
    
  return (
    <ReactModal isOpen style={customStyles} onRequestClose={handleClickCancel}
    shouldCloseOnOverlayClick={true}>
      <h4>Login</h4>
      <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={handleClickSubmit}
    >
      <Form.Item
        name="id"
        rules={[
          {
            type: 'email',
            message: '아이디는 E-mail 형식이어야 합니다!',
          },
          {
            required: true,
            message: '아이디를 적어주세요',
          },
        ]}
      >
        <Input  prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" value={id} onChange={onChangeId}/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: '비밀번호를 적어주세요',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChangePassword}
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        {/* <a className="login-form-forgot" href="">
          Forgot password
        </a> */}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit"  >
          Log in
        </Button><span>  </span>
        <Button type="primary" onClick={handleClickCancel}danger >
          Cancel
        </Button>
        <div> Or  <Link to="/join">register now!</Link></div>
      </Form.Item>
    </Form>
    </ReactModal>
  )
};

export default LoginModal;

