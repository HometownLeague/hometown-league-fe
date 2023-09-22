import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { push } from "redux-first-history";

import Swal from 'sweetalert2';

function Main() {
  const user = useSelector((state) => state.user.user);

  const location = useLocation();

  // 메인 페이지
  const dispatch = useDispatch();

  const is_user = localStorage.getItem("user") ? true : false;

  // 인기 추천 리스트
  const popularList = useSelector((state) => state.post?.popular_list);
  // 온라인 추천 리스트
  const onlineList = useSelector((state) => state.post?.online_list);


  const [isOpen, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  }
  useEffect(() => {
  }, []);

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
      <Wrap>
        <TitleContainer>
          <Title>이적시장 선수 찾기</Title>
        </TitleContainer>
        <EmptyList>
          <p>팀을 위한 선수를 찾으세요!</p>
          {user ? (
            <StlyedLink to="/">
              영입 하러 가기 {'>'}
            </StlyedLink>
          ) : (
            <StlyedLink to="/">
              로그인하러 가기 {'>'}
            </StlyedLink>
          )}
        </EmptyList>
      </Wrap>
    </>
  );
}

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
  background: transparent linear-gradient(124deg, #7f58ec 0%, #5c5ce3 100%) 0%
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
export default Main;