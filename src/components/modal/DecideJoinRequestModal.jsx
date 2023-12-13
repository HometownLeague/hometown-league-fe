import React,{ useState,useCallback, useEffect } from "react";
import ReactModal from 'react-modal';
import styled from "styled-components";
import { Button, Form, } from 'antd';
import { useDispatch,useSelector } from "react-redux";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Text, Image } from "..//elements";
import GlobalStyle from '../../styles/GlobalStyle';
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
const api = process.env.REACT_APP_API_URL;

function DecideJoinRequestModal({onSubmit, onClose,teamId,playerName,requestId}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isAccept,SetIsAccept] =useState();

  const handleClickCancel = () => {
    onClose();
  };
  //가입 승인/거부 API
  const handleClickSubmit =()=>{
    axios.get(`${api}/team/accept`)
    .then((response) => {
        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          
        } else {
          Swal.fire({
            text: "소속선수 조회 실패",
            confirmButtonColor: "#E3344E",
          });
        }
      })
      .catch((err) => console.log(err));
    onSubmit();
    window.location.reload();
  }
  return (
    <ReactModal isOpen style={customStyles} onRequestClose={handleClickCancel}
    shouldCloseOnOverlayClick={true}>
      <h4>{playerName}의 가입 요청을 승인하시겠습니까?</h4>
      <Form >
      <Form.Item style={{ textAlign: 'center', marginTop:10}}>
        <Button type="primary" htmlType="submit">
          예
        </Button><span>  </span>
        <Button type="primary" htmlType="submit">
          아니오
        </Button>
        <Button type="primary" onClick={handleClickCancel}danger >
          Cancel
        </Button>

      </Form.Item>
    </Form>
    </ReactModal>
  )
  return (
    <div>DecideJoinRequestModal</div>
  )
}

export default DecideJoinRequestModal

const Player = styled.div`
margin: auto;
width:200px;
box-sizing:content-box;
padding: 4px 4px;
border-radius: 103px;
display: flex;
justify-content:space-around;
align-items: center;
border-color:var(--blue2);
background-color: ${(props) => (props.active ? 'pink' : 'initial')};
border: ${(props) => (props.active ? '2px solid pink' : '2px solid transparent')};
cursor: pointer;
&:hover {
  border: ${(props) => (props.active ? '2px solid hotpink' : '2px solid pink')};
}
`;
const PlayerNameBox=styled.div`
:hover {
  transform: scale(1.3);
}
`