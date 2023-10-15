import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Text, Image,} from "../components/elements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import { actionCreators as teamActions } from "../redux/teamApi";

function CardViewContent({team,isMatchingView}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    dispatch(teamActions.getUserTeamsDB());
  }, []);
  return (
    <GroupBox key={team.id}>
      {team.logo ?
       <>
        <Image src={team.logo}
          width="50px"
          height="45px"
          contain />
      </> :
      <>
        <FontAwesomeIcon icon={faPersonRunning} />
      </>}
      <TextBox>
        <Text size="15px" $title>
          {team.name}
        </Text>
        {isMatchingView&&(
          <Text size="15px" $title>
            {team.status==="W"?'매칭 대기중':'매칭 완료'}
        </Text>
        )}
      </TextBox>
    </GroupBox>
  )
}

export default CardViewContent;

const GroupBox = styled.div`
max-width: 220px;
min-width: 220px;
overflow: hidden;
background-color: rgb(255, 255, 255, 0.4);
border-radius: 10px;
box-shadow: 0px 1px 8px #dfdbdb;
text-align: center;
align-items: center;
min-height: 130px;
max-height: 130px;
padding: 10px 20px;
box-sizing: border-box;
font-size: 17px;
display: flex;
justify-content: space-between;
margin: 0 10px 0 0;
@media all and (max-width:767px)
{
min-height: 20%;
height: 130px;
}
text-decoration:none;
color:black;
`;

const TextBox = styled.div`
  min-width: 80px;
  box-sizing: border-box;
  padding: 0 5px 0 0;
`;
