import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";

import { actionCreators as teamActions } from "../redux/teamApi";
import { Grid, Text, Image } from './../components/elements'
import { medal1st, medal2nd, medal3rd, teamDefalutImg } from '../assets/images';
function Main() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const is_user = localStorage.getItem("user") ? true : false;
  // 인기 추천 리스트
  //const popularList = useSelector((state) => state.post?.popular_list);
  const rankingList = useSelector((state) => state.team?.rank);
  useEffect(() => {
    dispatch(teamActions.getRankDB(10));
  }, [])

  return (
    <>
      <Wrap>
        <TitleContainer>
          <Title>팀 찾기</Title>
        </TitleContainer>
        <EmptyList>
          <p>지역을 설정하고 팀을 찾아보세요!</p>
          <StlyedLink to="/userProfile">
            지역 설정하기 {'>'}
          </StlyedLink>
        </EmptyList>
      </Wrap>
      <RankList>
        <TitleContainer>
          <Title>랭킹</Title>
        </TitleContainer>
        <Grid>
          {rankingList.map((r, idx) => {
            return (
              <Rank className={idx}>
                {(() => {
                  switch (idx) {
                    case 0:
                      return <Image
                        src={medal1st}
                        width="40px"
                        height="40px"
                        contain
                      />;
                    case 1:
                      return <Image
                        src={medal2nd}
                        width="40px"
                        height="40px"
                        contain
                      />;
                    case 2:
                      return <Image
                        src={medal3rd}
                        width="40px"
                        height="40px"
                        contain
                      />;
                    default:
                      return <Image
                        src={teamDefalutImg}
                        width="40px"
                        height="40px"
                        contain
                      />;
                  }
                })()}
                <Text bold title >
                  {r.name}
                </Text>
                <Text size="12px" center title>
                  <Point>{r.rankScore}점</Point>
                  <br />
                  {r.playerCount}명
                </Text>
              </Rank>
            )
          })}
        </Grid>
      </RankList>
    </>
  );
}
export default Main;

const Wrap = styled.div`
  margin: 75px 0;
  cursor: default;
  @media only screen and (max-width: 1024px) {
    margin: 75px 27px;
  }
  @media only screen and (max-width: 414px) {
    margin: 55px 17px;
  }
`;

const TitleContainer = styled.div`
  max-width: 1004px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #333;
`;
const Title = styled.div`
  font-size: 20px;
  letter-spacing: -0.6px;
  font-weight: 700;
  @media only screen and (max-width: 1024px) {
    font-size: 16px;
    letter-spacing: -0.48px;
  }
  @media only screen and (max-width: 414px) {
    font-size: 15px;
    letter-spacing: -0.45px;
  }
`;
const EmptyList = styled.div`
  max-width: 1004px;
  margin: 20px auto;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 149px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 5px 15px #0000000d;
  border-radius: 15px;
  & p {
    text-align: center;
    font-size: 18px;
    font-family: Noto Sans CJK KR;
    letter-spacing: -0.54px;
    color: #666;
  }
  @media only screen and (max-width: 414px) {
    height: 109px;
    & p {
      font-size: 16px;
    }
    & button {
      font-size: 13px;
    }
  }
`;
const StlyedLink = styled(Link)`
  max-width: 165px;
  height: 28px;
  font-size: 15px;
  color: #ffffff;
  background: transparent linear-gradient(124deg, #00AFF0 0%,#22668D 100%) 0%
    0% no-repeat padding-box;
  border-radius: 14px;
  border: none;
  padding: 3px 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
}`
const BoxTitle = styled.div`
  color: #e3344e;
  font-size: 24px;
  font-family: "GmarketSansBold";
  letter-spacing: 1.2px;
  position: absolute;
  top: -23px;
  display: flex;
`;

const RankList = styled.div`
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

const Rank = styled.div`
margin: 13px auto 0 auto;
width:300px;
height:48px;
box-sizing:border-box;
background-color: ${(props) => (props.className > 2 ? "#ffffff;" : "#FFFADD;")}
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
  color: #e3344e;
`;