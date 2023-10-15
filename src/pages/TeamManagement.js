import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import styled from "styled-components";
import { Button, Text, Image, Grid } from "../components/elements";
import { history } from "../redux/configStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning, faPeopleGroup, faPlus } from '@fortawesome/free-solid-svg-icons';

import { actionCreators as teamActions } from "../redux/teamApi";
import { modals } from '../components/modal/Modals';
import useModals from '../components/modal/useModal';
import CreateTeamModal from '../components/modal/CreateTeamModal';
import { Link } from 'react-router-dom';
import TeamForm from '../components/forms/TeamForm';
import CardViewContent from '../components/CardViewContent';

function TeamManagement() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isEditingNewTeam, setIsEditingNewTeam] = useState(false);
  //TODO - team api 연결하기
  const teamList = useSelector((state) => state.team.userTeams);
  // let teamList = [...team_List]
  // teamList.push({
  //   id: 16,
  //   name: "Sunny Eleven",
  //   ownerYn: "Y"
  // });

  const alert = () => {
    Swal.fire({
      html: `원활한 매칭을 위해<br/>팀은 2개만 만들 수 있어요 😸`,
      confirmButtonColor: "rgb(118, 118, 118)",
    });
  };
  const startEditingHandler = () => {
    setIsEditingNewTeam(true);
  };

  const stopEditingHandler = () => {
    setIsEditingNewTeam(false);
  };
  const { openModal } = useModals();
  const openLoginModal = () => {
    openModal(modals.loginModal, { onsubmit: (value) => { console.log(value) } });
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
    }
    dispatch(teamActions.getUserTeamsDB());
  }, [user]);

  return (
    <>
      <ContentBox>
        <ListBox>
          <BoxTitle>마이 팀</BoxTitle>

          {user && teamList && teamList.map((team, idx) => {
            return (
              <Link key={team.id} to={`/team/profile/${team.id}`}>
                <CardViewContent team={team} isMatchingView={false} />
              </Link>
            );
          })}
        </ListBox>

        <Grid margin="0 10px 0 32px" width="85%" height="120px">
          <Grid>
            <Text $title $bold>
              원하는 팀을{" "}
            </Text>
            <Text $title $bold>
              못 찾으셨나요?{" "}
            </Text>
            <Text $title $bold>
              <Point>나만의 팀</Point>을 만드세요!{" "}
            </Text>
          </Grid>
        </Grid>
        <IconBox>
          {!isEditingNewTeam && (
            <>
              {teamList && teamList.length >= 2 ? (
                <IconBox onClick={alert}>
                  <FontAwesomeIcon icon={faPeopleGroup} style={{ color: "#e3344e", fontSize: 45 }} />
                  <FontAwesomeIcon icon={faPlus} />
                </IconBox>
              ) : (
                <IconBox onClick={startEditingHandler}>
                  <FontAwesomeIcon icon={faPeopleGroup} style={{ color: "#e3344e", fontSize: 45 }} />
                  <FontAwesomeIcon icon={faPlus} />
                </IconBox>
              )}
            </>
          )}
        </IconBox>
        {isEditingNewTeam && (<TeamForm onClose={stopEditingHandler} isCreating="true" isUpdate='false' />)}
      </ContentBox>
    </>
  );
};

export default TeamManagement

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


const IconBox = styled.div`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

const Point = styled.span`
  color: #e3344e;
`;
