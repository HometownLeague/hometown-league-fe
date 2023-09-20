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
const ChangeOwnerModal = ({onSubmit, onClose,teamId}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [owner, setOwner] =useState(null);

  const [teamPlayers, setTeamPlayers] = useState([])

  const handleClickPlayer = (playerId) => {
    setOwner(playerId);
  };
  const handleClickCancel = () => {
    onClose();
  };
  //주장 변경API
  const handleClickSubmit = useCallback(({newOwnerId})=>{
    dispatch(teamAction.updateTeamOwnerDB(teamId,newOwnerId));
    onSubmit();
  },[]);

  useEffect(()=>{
    axios({
      method: "get",
      url: `/team/${teamId}/players`,
    })
      .then((response) => {
        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          setTeamPlayers(response.data.data.users)
        } else {
          Swal.fire({
            text: "소속선수 조회 실패",
            confirmButtonColor: "#E3344E",
          });
        }
      })
      .catch((err) => console.log(err));
  },[])
  return (
    <ReactModal isOpen style={customStyles} onRequestClose={handleClickCancel}
    shouldCloseOnOverlayClick={true}>
      <h4>주장 변경</h4>
      <Form onFinish={handleClickSubmit}>
        {teamPlayers.map(p => {
          if(p.id==user.id)return(<></>)
          return(
          <Player key={p.id} onClick={() => handleClickPlayer(p.id)} active={p.id === owner}>
            {/* <Image
              src={Playerimg}
              width="30px"
              height="40px"
              contain
            /> */}
            <PlayerNameBox>
            <Text bold title>{p.nickname}</Text>
            </PlayerNameBox>
          </Player>
        )
        })}
      <Form.Item style={{ textAlign: 'center', marginTop:10}}>
        <Button type="primary" htmlType="submit">
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