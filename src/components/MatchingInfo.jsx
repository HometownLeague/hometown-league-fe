import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components"
import dayjs from 'dayjs';
import { useSelector, useDispatch } from "react-redux";
import { CloseOutlined ,UploadOutlined,MinusCircleOutlined,PlusOutlined} from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

import { Text,Grid,Image } from "./elements";
import { actionCreators as matchActions } from "../redux/matchApi";
import {KakaoMap} from '../components';

function MatchingInfo({onClose,matchingRequestId,teamId}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const matchingList=useSelector((state)=>state.matching.detailMatchingList);
  const matchingData=matchingList.find(m=>m.matchingRequestId===matchingRequestId);
  // const [otherTeamData,setOtherTeamData]=useState({});

  const statusMent=()=>{
    if(matchingData.data.status==='W') return "매칭이 아직 안잡혔어요, 조금만 더 기다려 주세요."
    else if(matchingData.data.status==='B') return "매칭이 잡혔습니다. 수락을 눌러주세요!"
    else if(matchingData.data.status==='O') return "상대 팀의 수락을 기다려 주세요."
    else return "경기 날만 기다리는 중!"
  }//, 경기 확정을 위해 매칭 수락을 눌러주세요.

  const timeMent=()=>{
    const currentTime = dayjs();
    const targetTime = dayjs(matchingData.data.requestTimestamp, { format: 'YYYYMMDDHHmmss' });
    const duration = currentTime.diff(targetTime, 'hours');
    console.log(duration)
    return `매칭을 요청한지 ${duration}시간 지났습니다.`
  }

  useEffect(() => {
    dispatch(matchActions.getDetailMatchingDB(matchingRequestId));
    let polling = setInterval(() => {
      dispatch(matchActions.getDetailMatchingDB(matchingRequestId));
    }, 600000);//10분
    // 페이지에 벗어날 경우 polling X
    return () => {
        clearInterval(polling);
    };
  }, []);

  return (
    <ContainerBox >
      <Mentbox>
        <Text size="18px" margin="-1px 0px 0px 7px" bold>
          <Point>{user.nickname}님</Point> {statusMent()}
        </Text>
        <Text size="12px" margin="0px 0px 0px 11px">
          {timeMent()}
        </Text>
      </Mentbox>
      <Content>
        <ItemBox>
        {/* 장소, 시간 정보 */}
        <Text size="18px" margin="-1px 0px 0px 7px" bold>경기 일시</Text>

        <Text size="18px" margin="-1px 0px 0px 7px" bold>경기 장소</Text>
        <KakaoMap searchplace=''/>
        </ItemBox>
        {matchingData.data.ourTeam&&(
        <ItemBox>
          <TeamBox>
            <Rank>
              <BoxTitle>{matchingData.data.ourTeam.team.name}</BoxTitle>
              <Text size="8px" center title>
                <Point>{matchingData.data.ourTeam.team.rankScore}점</Point>
              </Text>
            </Rank>
              {/* <FontAwesomeIcon icon={faPersonRunning} /> */}
            <div>

              <BoxTitle>선수진</BoxTitle>
              <Grid>
                {matchingData.data.ourTeam.players.map((p, idx) => {
                  <Rank>
                    <Text bold title>
                      {p.nickname}
                    </Text>
                  </Rank>
                })}
              </Grid>
            </div>
          </TeamBox> 
        </ItemBox>
        )}
        <ItemBox>
          {matchingData.data.matchingDetail.status!=='W'?(
            <TeamBox>
              <Rank>
                <BoxTitle>{matchingData.data.otherTeam.team.name}</BoxTitle>
                <Text size="8px" center title>
                  <Point>{matchingData.data.otherTeam.team.rankScore}점</Point>
                </Text>
              </Rank>
                {/* <FontAwesomeIcon icon={faPersonRunning} /> */}
              <div>

                <BoxTitle>선수진</BoxTitle>
                <Grid>
                  {matchingData.data.otherTeam.players.map((p, idx) => {
                    <Rank>
                      <Text bold title>
                        {p.nickname}
                      </Text>
                    </Rank>
                  })}
                </Grid>
              </div>
          </TeamBox> 
        ):(
          <TeamBox>
            <BoxTitle>상대팀</BoxTitle>
            <Text bold title>아직 정해지지 않았어요 </Text>
          </TeamBox>
        )}
        </ItemBox> 
      </Content>
    </ContainerBox>
  )
}

export default MatchingInfo
const ContainerBox = styled.div`
  width: 70%;
  min-width: 749px;
  max-width: 1004px;
  margin: 0 auto;
  @media all and (max-width: 768px) {
  width: 94%;
  min-width: 720px;s
  }
  @media all and (max-width: 415px) {
      min-width: 374px;
      width: 100%;
  }
`;
const Content=styled.div`
  display: flex;
  justify-content: space-between;
  @media all and (max-width: 415px) {
      flex-direction: column;
      width: 90%;
      margin: auto;
}
`;

const Mentbox = styled.div`
  display:felx;
  @media all and (max-width:767px)
 {width:100%;}
`;
const ItemBox = styled.div`
width: 98%;
    min-height: 140px;
    box-sizing: border-box;
    background-color: #ffffff;
    box-shadow: 0px 10px 15px #e0e0e0;
    border-radius: 15px;
    position: relative;
    padding: 25px 30px;
    margin: 0 0 20px 0;
    ${(props) => (props.flex ? `display:flex` : "")};
    & strong {
        font-size: 20px;
        font-weight: 600;
        display: block;
        width: 100%;
        margin: 0 0 16.5px 0;
        cursor: default;
        @media all and (max-width: 768px){
            font-size: 19px;
        }
        @media all and (max-width: 414px){
            font-size: 16px;
        }
    }
    & p {
        cursor: default;
    }
`
const TeamBox = styled.div`

`;
const BoxTitle = styled.div`
  color: #00AFF0;
  font-size: 24px;
  letter-spacing: 1.2px;

  top: -23px;
  display: flex;
`;

const Rank = styled.div`
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

const Point = styled.span`
  color: #22668D;
`;

const PlayerNameBox=styled.div`
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
`