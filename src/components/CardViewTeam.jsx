import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import useModals from './modal/useModal';
import { modals } from './modal/Modals';
import {Trophy } from "../assets/images";
import { Text } from './elements';
import { actionCreators as teamAction } from "../redux/teamApi";
import { teamDefalutImg } from '../assets/images';

const api = process.env.REACT_APP_API_URL

function CardViewTeam({teamInfo}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { openModal } = useModals();
  const openLoginModal = () => {
    openModal(modals.loginModal, { onsubmit: (value) => { console.log(value) } });
  };
  const onClickTeamCard=(e)=>{
    // e.preventdefault();
    if (!user) {
      Swal.fire({
        text: "로그인 후 이용 가능합니다. ",
        confirmButtonColor: "#E3344E",
      }).then((result) => {
        if (result.isConfirmed) {
          openLoginModal();
        }
      })
    }
    Swal.fire({
      text: "팀에 가입 요청을 보내시겠습니까?",
      confirmButtonColor: "#FFCC70",
      confirmButtonText:'예',
      cancelButtonText:'아니오'
    }).then((responseult) => {
      if (responseult.isConfirmed) {
        dispatch(teamAction.joinTeamRequestDB(teamInfo.id));
      }
    });
  }
  return (
    <>
      <CardWrap className='wrap' onClick={onClickTeamCard}>
      {teamInfo.ciPath ? (
              <Img
                src={`${api}/image-team/${teamInfo.ciPath}`}
                margin="30px 0 0 0"
                radius="100%"
                contain
              />
            ) : (
              <Img
                src={teamDefalutImg}
                margin="30px 0 0 0"
                radius="100%"
                contain
              />)}
          <TextBox>
            <SportKind>축구</SportKind>
            <div>
              <Text title bold>{teamInfo?.name}</Text>
              <TextInfo>
                <div>
                  {teamInfo && (
                      <>
                        <span style={{ fontWeight: '600' }}>
                          {teamInfo?.rankScore}
                        </span>
                      </>
                    )} 
                </div>
              </TextInfo>
              <ScoreInfo>
                <InfoBox>
                  <div>
                    <span>{teamInfo?.description}</span> 
                  </div>
                </InfoBox>
              </ScoreInfo>
            </div>
          </TextBox>
      </CardWrap>
    </>
  );
}

const CardWrap = styled.div`
  border-radius: 10px;
  box-shadow: 0px 10px 15px #e0e0e0;
  max-width: 240px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
  @media only screen and (max-width: 1024px) {
    margin-top: 11.27px;
    max-width: 215px;
    height: 280.73px;
    margin-bottom: 20px;
  }

  @media only screen and (max-width: 414px) {
    margin-top: 11.27px;
    max-width: 162px;
    height: 235.73px;
    margin-bottom: 20px;
  }
`;
const Img = styled.img`
  width: 100%;
  object-fit:cover;
  height: 102px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  &:hover {
    opacity: 0.7;
  }
  @media only screen and (max-width: 1024px) {
    height: 165px;
  }
  @media only screen and (max-width: 414px) {
    height: 126px;
  }
`;
const TextBox = styled.div`
  width: 100%;
  padding: 15px 12px;
  box-sizing: border-box;
  line-height: 1.8;
  & strong {
    font-size: 15px;
    font-family: 'Noto Sans CJK KR';
    font-weight: 600;
    letter-spacing: -0.45px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1.2;
    height: 2.4em;
    text-align: left;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const SportKind = styled.div`
  position: absolute;
  top: 14px;
  right: 3px;
  padding: 1px 5px;
  box-sizing: border-box;
  font-size: 13px;
  letter-spacing: -0.39px;
  color: #fff;
  background: #333 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #22668D;
  border-radius: 5px;
  opacity: 0.72;
`;

const TextInfo = styled.div`
  font-size: 13px;
  letter-spacing: -0.39px;
  color: #666;
  display: flex;
  flex-direction: column;
  line-height: 2.1;
  height: 27px;
  overflow: hidden;
  margin-top: -18.11px;
  @media only screen and (max-width: 1024px) {
    font-size: 11px;
    letter-spacing: -0.22px;
    overflow: hidden;
  }
  @media only screen and (max-width: 414px) {
    font-size: 11px;
    letter-spacing: -0.11px;
    height: 21px;
    overflow: hidden;
  }
`;
const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  letter-spacing: -0.42px;
  @media only screen and (max-width: 1024px) {
    font-size: 12px;
    letter-spacing: -0.24px;
  }
  @media only screen and (max-width: 414px) {
    font-size: 12px;
    letter-spacing: -0.12px;
  }
`;
const ScoreInfo = styled.div`
  color: #333;
`;

export default CardViewTeam;