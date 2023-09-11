import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2';

function Main(props) {
  // 메인 페이지
  const dispatch = useDispatch();
  const { history } = props;
  const is_user = localStorage.getItem("user") ? true : false;

  // 인기 취미 추천 리스트
  const popularList = useSelector((state) => state.post?.popular_list);
  // 온라인 추천 리스트
  const onlineList = useSelector((state) => state.post?.online_list);
  // 오프라인 추천 리스트

  const [isOpen, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  }
  useEffect(() => {

    // if (props.location.error) {
    //   setTimeout(() => {
    //     Swal.fire({
    //       text: `${props.location.error}에 이미 가입된 이메일입니다.\n ${props.location.error}로 다시 시도해 주세요`,
    //       confirmButtonColor: '#7F58EC',
    //       confirmButtonText: '확인',
    //     });
    //     props.history.replace({
    //       pathname: props.location.pathname,
    //       state: {},
    //     });
    //   }, 500);
    // }
  }, []);

  return (
    <>
      <Wrap>
        <TitleContainer>
          <Title>팀 찾기</Title>
        </TitleContainer>
        <EmptyList>
          <p>지역을 설정하고 팀을 찾아보세요!</p>
          <button
            onClick={() => {
              history.push('/userdetail');
            }}
          >
            지역 설정하러 가기 {'>'}
          </button>
        </EmptyList>
      </Wrap>
      <Wrap>
        <TitleContainer>
          <Title>이적시장 선수 찾기</Title>
        </TitleContainer>
        <EmptyList>
          <p>팀을 위한 선수를 찾으세요!</p>
          <button
            onClick={() => {
              history.push('/login');
            }}
          >
            로그인하러 가기 {'>'}
          </button>
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
  & button {
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
    }
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

export default Main;