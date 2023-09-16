import React,{ useState,useCallback, useEffect } from "react";
import ReactModal from 'react-modal';
import styled from "styled-components";
import { Button, Form, } from 'antd';
import { useDispatch,useSelector } from "react-redux";

import { actionCreators as teamAction } from "../../redux/teamApi";

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
const ChangeOwnerModal = ({onSubmit, onClose,teamId}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [owner, onChangeOwner] =useState();
  const handleClickCancel = () => {
    onClose();
  };
  //주장 변경API
  const handleClickSubmit = useCallback(({newOwnerId})=>{
    dispatch(teamAction.loginDB(teamId,newOwnerId));
    onClose();
  },[]);
  useEffect(()=>{
    
  })
  return (
    <ReactModal isOpen style={customStyles} onRequestClose={handleClickCancel}
    shouldCloseOnOverlayClick={true}>
      <h4>주장 변경</h4>
      <Form onFinish={handleClickSubmit}>
      {}
      <Form.Item>
        <Button type="primary" htmlType="submit"  >
          Change
        </Button><span>  </span>
        <Button type="primary" onClick={handleClickCancel}danger >
          Cancel
        </Button>
      </Form.Item>
    </Form>
    </ReactModal>
  )
};

export default ChangeOwnerModal;

