import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Text, Grid, Image, Button } from "../components/elements";
import axios from 'axios';
import Swal from 'sweetalert2';

import { actionCreators as teamActions } from "../redux/teamApi";
import { actionCreators as matchActions } from "../redux/matchApi";
import useModals from '../components/modal/useModal';
import { modals } from '../components/modal/Modals';
import { MatchingInfo, CardViewContent } from '../components';

function MyMatching() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const matchingList = useSelector((state) => state.matching.matchingList);
  // const isLoading = useSelector((state) => state.teamData.isLoading);
  const [matchingRequestId, setMatchingRequestId] = useState();
  const [teamId, setTeamId] = useState();
  const [isOpenCard, setIsOpenCard] = useState(false);

  const { openModal } = useModals();
  const openLoginModal = () => {
    openModal(modals.loginModal, { onsubmit: (value) => { console.log(value) } });
  };

  const openCardHandler = (rId, tId) => {
    setMatchingRequestId(rId);
    setTeamId(tId);
    setIsOpenCard(true);

  };

  const closeCardHandler = () => {
    setIsOpenCard(false);
  };
  useEffect(() => {
    if (!user) {
      Swal.fire({
        text: "로그인 후 이용 가능합니다. ",
        confirmButtonColor: "#E3344E",
      }).then((result) => {
        if (result.isConfirmed) {
          openLoginModal();
        }
      })
    } else
      dispatch(matchActions.getUserMatchingDB(user.id));
  }, [user]);

  return (
    <ContentBox>
      {!isOpenCard && (
        <ListBox>
          <BoxTitle>매칭 리스트</BoxTitle>
          {user && matchingList && matchingList.map((match, idx) => {
            return (
              <div key={match.matchingRequestId} onClick={() => {
                openCardHandler(match.matchingRequestId, match.teamId);
              }} >
                <CardViewContent team={match} isMatchingView="true" />
              </div>
            );
          })}
        </ListBox>
      )}


      {isOpenCard && (<MatchingInfo onClose={closeCardHandler} matchingRequestId={matchingRequestId} teamId={teamId} />)}
    </ContentBox>

  )
}

export default MyMatching

const ContentBox = styled.div`
  margin: 60px auto 0px auto;
  padding: 0px 100px 0 130px;
  width: 85%;
  gap: 35px;
  @media all and  (max-width:1023px){
    margin:0 0 0 80px ;
    padding:130px 0 0 0;
    box-sizing:border-box;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-end;
  }
  @media all and (max-width:767px)
 { margin:0 0 0 50px ;
  padding:23px 0 0 0;
   gap: 0px; }
`;
const BoxTitle = styled.div`
  color: #9b9b9b;
  font-size: 24px;
  font-family: "GmarketSansBold";
  letter-spacing: 1.2px;
  position: absolute;
  top: -23px;
`;
const ListBox = styled.div`
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 10px;
  box-shadow: 0px 1px 8px #dfdbdb;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  min-height: 170px;
  max-height: 170px;
  font-size: 17px;
  margin-bottom: 30px;
  display: flex;
  @media all and (min-width:768px) and (max-width:1023px)
 {width: 80%;
 max-height: 380px;
 flex-wrap:wrap;
 align-items:center;
 margin-bottom:80px;
}
  @media all and (max-width:767px)
 {width: 80%;
 height:380px;
 max-height: 380px;
 flex-direction:column;
 }
  & :last-child {
    margin: 0px;
  }
  position: relative;
`;

