import React,{ useState,useCallback, useEffect } from "react";
import ReactModal from 'react-modal';
import styled from "styled-components";
import { Button, Form,Input } from 'antd';
import { useDispatch,useSelector } from "react-redux";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Text, Image } from "..//elements";
import GlobalStyle from '../../styles/GlobalStyle';
import { actionCreators as matchAction } from "../../redux/matchApi";

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

function GameResultInputModal({onSubmit, onClose,matchingRequestId}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [score, setScore] =useState([]);

  const handleClickCancel = () => {
    onClose();
  };
  const handleClickSubmit =(values)=>{
    dispatch(matchAction.submitMatchingResultDB(matchingRequestId,values.ourTeamScore,values.otherTeamScore));
    onSubmit();
  }
  return (
  <ReactModal isOpen style={customStyles} onRequestClose={handleClickCancel} shouldCloseOnOverlayClick={true}>
   <h4>경기 결과 입력</h4>
   <Form onFinish={handleClickSubmit}>
    <Form.Item label="우리 팀 점수"  name="ourTeamScore" required>
     <Input/>
    </Form.Item>
    <Form.Item label="상대 팀 점수"  name="otherTeamScore" required>
     <Input/>
    </Form.Item>
    <Form.Item style={{ textAlign: 'center', marginTop:10}}>
    <Button type="primary" htmlType="submit">
      Change
    </Button><span>  </span>
    <Button type="primary" onClick={handleClickCancel}danger >
      Cancel
    </Button>
  </Form.Item>
    </Form>
    <div>
      양 팀의 결과가 다를 경우 점수에 반영되지 않습니다.
      지속적인 신고가 있을 경우 제제가 있을 수 있습니다.
    </div>
  </ReactModal>
  );
  
}

export default GameResultInputModal


