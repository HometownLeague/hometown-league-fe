import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { actionCreators as teamAction } from "../redux/teamApi";
import { history } from "../redux/configStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Text, Grid, Image, Button } from "../components/elements";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Playerimg, Trophy } from "../images";
import { Layout, Space } from 'antd';
import useModals from '../components/modal/useModal';
import { modals } from '../components/modal/Modals';

const { Header, Footer, Sider, Content } = Layout;

function TeamProfile() {
  const params = useParams()
  const teamId = params.id
  const dispatch = useDispatch();
  const [teamData, setTeamData] = useState({})
  const [teamPlayers, setTeamPlayers] = useState([])
  const [isOwner, setIsOwner] = useState(false)
  const user = useSelector((state) => state.user.user);
  // const isLoading = useSelector((state) => state.teamData.isLoading);

  const { openModal } = useModals();
  const openUpdateTeamModal = () => {
    openModal(modals.createTeamModal, { onsubmit: (value) => { console.log(value) } });
  };

  useEffect(() => {

    //dispatch(teamAction.getTeamDetailDB(teamId));
    axios({
      method: "get",
      url: `/team/${teamId}`,
    })
      .then((response) => {
        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          setTeamData(response.data.data)
        } else {
          Swal.fire({
            text: response.data.responseCode.message,
            confirmButtonColor: "#E3344E",
          });
        }
      })
      .catch((err) => console.log(err));
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
    if (teamData.ownerId !== user.id) setIsOwner(false)
    else setIsOwner(true)
  }, [])

  return (
    <Fragment>
      {/* 점수, 팀 설명 header */}
      <ContainerBox>
        {/* 왼쪽 바 */}
        <Layout hasSider>
          <Sider style={siderStyle}>
            <Image
              src={Trophy}
              width="220px"
              height="80px"
              margin="30px 0 0 0"
              contain
            />
            <TeamNameBox>
              <Text size="20px" color='black'>
                {teamData.name}
              </Text>
              {isOwner && (
                <IconBox>
                  <IconInnerBox>
                    <FontAwesomeIcon icon={faPenToSquare} size='2L' color='black' onClick={openUpdateTeamModal} />
                  </IconInnerBox>
                </IconBox>
              )}
            </TeamNameBox>
            <ButtonBox>
              <Button
                radius="5px 5px 5px 5px"
                size="12px"

                padding=" 3.6px 0"
                margin="0 0 10px 0"
                bg="#ffffff"
                color="#8ECDDD"
                _onClick={() => {
                  history.push(`/team/${teamId}/gameResult`)
                }}> 경기 결과 조회 </Button>
              {isOwner ? (
                <ButtonBox>
                  <Button radius="5px 5px 5px 5px"
                    size="12px"
                    padding=" 3.6px 0"
                    margin="0 0 10px 0"
                    bg="#ffffff"
                    color="#8ECDDD"
                    _onClick={openUpdateTeamModal}> 주장 변경 </Button>
                  <Button radius="5px 5px 5px 5px"
                    size="12px"
                    padding=" 3.6px 0"
                    margin="0 0 10px 0"
                    bg="#ffffff"
                    color="#8ECDDD"
                    _onClick={() => {

                    }}> 매칭 요청 </Button>
                </ButtonBox>
              ) : (
                <Button radius="5px 5px 5px 5px"
                  size="12px"
                  padding=" 3.6px 0"
                  margin="0 0 10px 0"
                  bg="#ffffff"
                  color="#8ECDDD"
                  _onClick={() => {
                  }}> 탈퇴하기 </Button>
              )}

            </ButtonBox>
          </Sider>
          <Content >
            <ListBox>
              <BoxTitle>

              </BoxTitle>
              <TeamBox>
                <Text bold margin="0 0 2px 0"> {teamData.name}</Text>
                <Text>{teamData.rankScore}</Text>
                <Text size="14px">{teamData.description}</Text>
              </TeamBox>
            </ListBox>
            <BoardList>
              {/* 선수단 div*/}
              <BoxTitle>선수단</BoxTitle>
              <Grid>
                {teamPlayers.map((p, idx) => {
                  return (
                    <Player>
                      <Image
                        src={Playerimg}
                        width="30px"
                        height="40px"
                        contain
                      />
                      <Text bold title>
                        {p.nickname}
                      </Text>

                    </Player>
                  )
                })}
              </Grid>

            </BoardList>
            {/* 공지사항, 일정 div */}
            <BoardList>
              <BoxTitle>공지사항</BoxTitle>
              <Grid is_flex width="100%">
                <AnnouncementContent>
                  <Text size="11px" center margin="3px 10px 0 10px" title>작성자1</Text>
                  <Text margin='0 0px 0px 10px' size="12px">
                    |
                    임시 공지사항입니다.</Text>
                </AnnouncementContent>
                <Grid is_flex width="60px">
                  <Text size="10px" center>23-09-09</Text>
                </Grid>
              </Grid>

            </BoardList>

          </Content>
        </Layout>

      </ContainerBox>

    </Fragment>
  );
}

export default TeamProfile;

const Logo = styled.img`

`;
const TeamNameBox = styled.div`
  flex-direction: row;

`;
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#FFFADD',
  left: 0,
};

const ButtonBox = styled.div`

`
const IconBox = styled.div`
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap:30px;
    margin:25px 0px;
    @media all and (max-width:767px)
 {width:100%;}
`

const IconInnerBox = styled.div`
    border-radius: 12px;
    width:50px;
    height: 50px;
    box-sizing: border-box;
    padding-top:7px;

    @media all and (max-width:767px)
 {width:100%;}

    &:hover{
        background-color: #ed5c72;
        border:1px solid #ed5c72;
    }
`
const AnnouncementContent = styled.div`
display:flex;
@media all and (max-width:767px)
 { max-height: 17.6px;
 overflow:hidden;
 }
`;
const ContainerBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  @media all and (max-width: 767px) {
    overflow: hidden;
  }
`;
const BoxTitle = styled.div`
  color:#22668D;
  font-size: 24px;
  letter-spacing: 1.2px;
  position: absolute;
  top: -23px;
  display: flex;
`;

const ListBox = styled.div`
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 10px;
  box-shadow: 0px 1px 8px #dfdbdb;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  font-size: 17px;
  margin-bottom: 30px;
  @media all and (max-width: 1023px) {
    width: 90%;
  }
  & :last-child {
    margin: 0px;
  }
  position: relative;
`;

const TeamBox = styled.div`
  width: 400px;
  height: 140px;
  overflow: hidden;
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 10px;
  box-shadow: 0px 1px 8px #dfdbdb;
  text-align: center;
  align-items: center;
  padding: 15px 20px;
  box-sizing: border-box;
  font-size: 17px;
  margin-bottom: 20px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 545px;
  }
  @media all and (max-width: 767px) {
    width: 250px;
  }
`;

const BoardList = styled.div`
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 10px;
  box-shadow: 0px 1px 8px #dfdbdb;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  font-size: 17px;
  margin-bottom: 30px;
  position: relative;
  justify-content: space-between;
  @media all and (max-width: 1023px) {
    width: 90%;
  }
`;

const Player = styled.div`
margin: 13px auto 0 auto;
width:210px;
height:48px;
box-sizing:border-box;
background-color: ${(props) => (props.className ? "#FCE3E3;" : "#ffffff;")}
    padding: 4px 23px;
    border-radius: 103px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    white-space: pre-line;
    @media all and (max-width:1023px)
 {height:35px;
 } 
`;
