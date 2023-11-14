import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { push } from "redux-first-history";
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { Select, Spin, Checkbox } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { ScrollUpButton } from '../components/elements';
import { InfinityScroll, CardViewTeam, SearchFilterForm } from "../components"
import { actionCreators as teamActions } from "../redux/teamApi";
import { Box } from '../assets/images';
import { useMemo } from 'react';
const { Option } = Select;

function TeamSearch() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  // 게시물 조회 로딩 정보
  const is_loading = useSelector((state) => state.team.isLoading);

  // 정렬(점수순)
  const [sortStatus, setSortStatus] = useState(null);
  const onChangeSortStatus = (value) => {
    setSortStatus(value);
  };
  // 게시물 정보
  const allTeam = useSelector((state) => state.team.allTeamList);
  let filteredList = useSelector((state) => state.team.filteredTeamlist);
  const [searchedList, setSearchedList] = useState([]);// 보여줄 리스트
  const [filterValue, setFilterValue] = useState();
  useEffect(() => {
    //제일 처음
    dispatch(teamActions.getSearchAllTeamDB());
    setSearchedList(allTeam);
  }, []);
  const onSubmitFilter = (value) => {
    dispatch(
      teamActions.getSearchTeamDB(
        value
      )
    );
    setSearchedList(filteredList);
    setFilterValue(value);
  }
  return (
    <>
      <Container>
        <MainContainer>
          {!is_loading ? (
            <>
              <MainHeader>
                <HeaderWrap>
                  <SearchFilterForm onSubmit={onSubmitFilter} defaultValue={filterValue} />
                  <SelectDiv>
                    <Sort>
                      <Select
                        defaultValue='scoreDesc'
                        style={{ width: '100%' }}
                        onChange={onChangeSortStatus}
                        value={sortStatus}
                      >
                        <Option value='scoreAsc' className='opt'>
                          랭크 낮은 순
                        </Option>
                        <Option value='scoreDesc' className='opt'>
                          랭크 높은 순
                        </Option>
                        {sortStatus === "scoreAsc"
                          ? "▲"
                          : sortStatus === "scoreDesc"
                            ? "▼"
                            : ""}
                      </Select>
                    </Sort>
                  </SelectDiv>
                </HeaderWrap>

              </MainHeader>

              <Main>
                {searchedList.length === 0 ? (
                  <>
                    {/* 항목 없을때 */}
                    <EmptyBox>
                      <img src={Box} alt='empty' />
                      <p>찾는 팀이 없습니다!</p>
                    </EmptyBox>
                  </>
                ) : (
                  <>
                    {searchedList.map((val, idx) => {
                      return (
                        <CardViewTeam teamInfo={val} key={idx}
                        />
                      )
                    })}

                  </>
                )}
              </Main>
            </>
          ) : (
            <Spin
              size='large'
              tip='Loading...'
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </MainContainer>
      </Container>
    </>
  );
}
export default TeamSearch;
const Container = styled.div`
   display: flex;
   color: #333;
 `;

const MainContainer = styled.div`
   width: 60%;
   margin-left: 31px;
   position: relative;
   @media only screen and (max-width: 1024px) {
     width: 92%;
     margin: 0 auto;
     min-height: 600px;
     padding: 0 20px;
   }
   @media only screen and (max-width: 414px) {
     padding: 0;
   }
 
   @media only screen and (max-width: 372px) {
     width: 100%;
     margin: 0 5px;
   }
 `;
const MainHeader = styled.div`
   margin: 35px 0 20px 10px;
   max-width: 87%;
   display: flex;
   align-items: center;
   justify-content: space-between;
   @media only screen and (max-width: 1004px) {
     max-width: 100%;
     margin: 22px 10px 13px;
   }
   @media only screen and (max-width: 414px) {
     max-width: 100%;
     margin: 22px 10px 13px;
   }
 `;

const HeaderWrap = styled.div`
   display: flex;
   align-items: center;
 `;

const ChkWrap = styled.div`
   max-width: 87%;
   margin-left: 10px;
   margin-bottom: 31px;
   height: 149px;
   background: #ffffff 0% 0% no-repeat padding-box;
   box-shadow: 0px 5px 15px #0000000d;
   border: 0.5px solid #e4e4e4;
   border-radius: 15px;
 
   @media only screen and (max-width: 1371px) {
     height: 179px;
   }
   @media only screen and (max-width: 1004px) {
     max-width: 100%;
   }
   @media only screen and (max-width: 807px) {
     max-width: 100%;
     height: ${(props) => (props.is_close ? '70px' : '308px')};
   }
   @media only screen and (max-width: 414px) {
     height: ${(props) => (props.is_close ? '70px' : '328px')};
   }
 `;
const ChkTitle = styled.div`
   font-size: 17px;
   letter-spacing: -0.51px;
   font-weight: bold;
   color: ${(props) => (props.is_sub ? '#5E5E5E' : '#333')};
   margin-top: 22px;
   margin-left: 22px;
   @media only screen and (max-width: 1024px) {
     font-size: 16px;
     letter-spacing: -0.48px;
   }
   @media only screen and (max-width: 807px) {
     font-size: ${(props) => (props.is_sub ? '14px' : '16px')};
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-right: 28px;
     cursor: pointer;
   }
   @media only screen and (max-width: 414px) {
     font-size: ${(props) => (props.is_sub ? '14px' : '16px')};
     margin-left: 22px;
   }
   @media only screen and (max-width: 392px) {
     margin-left: 22px;
   }
 `;
const ChkItem = styled.div`
   margin-top: 18px;
   margin-left: 22px;
   .ant-checkbox-checked .ant-checkbox-inner {
     background-color: #7f58ec;
     border-color: #7f58ec;
   }
   & label {
     width: 113px;
     margin-right: 60px;
     margin-top: 5px;
   }
   & div {
     display: flex;
     flex-direction: row;
     flex-wrap: wrap;
     .ant-checkbox-wrapper + .ant-checkbox-wrapper {
       margin-left: 0;
     }
   }
   @media only screen and (max-width: 1024px) {
     & label {
       margin-right: 40px;
     }
   }
   @media only screen and (max-width: 414px) {
     margin-left: 42px;
     & label {
       margin-right: 40px;
       margin-top: 8px;
     }
   }
   @media only screen and (max-width: 392px) {
     margin-left: 22px;
   }
 `;
const SelectDiv = styled.div`
   display: flex;
   align-items: center;
 `;
const Sort = styled.div`
   max-width: 112px;
   min-width: 90px;
   margin-right: 15px;
   @media only screen and (max-width: 414px) {
     & span {
       font-size: 10px;
     }
   }
 `;

const Filter = styled.div`
   max-width: 94px;
   @media only screen and (max-width: 414px) {
     & span {
       font-size: 10px;
     }
   }
 `;

const SortWrap = styled.div`
   margin-left: 10px;
   max-width: 87%;
   display: flex;
   align-items: center;
   justify-content: ${(props) =>
    props.is_responsive ? 'space-between' : 'flex-end'};
   @media only screen and (max-width: 1004px) {
     max-width: 100%;
   }
   @media only screen and (max-width: 414px) {
     margin: 0 10px 20px 10px;
   }
 `;

const SortTitle = styled.div`
   font-size: 15px;
   letter-spacing: -0.45px;
 
   color: ${(props) => (props.is_responsive ? '#5E5E5E' : '#333')};
   font-weight: bold;
   margin-right: 12px;
   @media only screen and (max-width: 768px) {
     font-size: ${(props) => (props.is_responsive ? '14px' : '13px')};
     letter-spacing: -0.39px;
   }
   @media only screen and (max-width: 414px) {
     font-size: ${(props) => (props.is_responsive ? '14px' : '12px')};
     letter-spacing: -0.36px;
   }
 `;

const LocationDiv = styled.div`
   margin-right: 15px;
   max-width: 112px;
   min-width: 90px;
   @media only screen and (max-width: 414px) {
     & span {
       font-size: 10px;
     }
   }
 `;

const SecondLocationDiv = styled.div`
   min-width: 94px;
   @media only screen and (max-width: 414px) {
     min-width: 78.81px;
     & span {
       font-size: 10px;
     }
   }
 `;

const Title = styled.div`
   font-size: 16px;
   font-family: Noto Sans CJK KR;
   color: #333;
   cursor: default;
   letter-spacing: -0.48px;
   margin-right: 24px;
   @media only screen and (max-width: 768px) {
     font-size: 13px;
     letter-spacing: -0.24px;
     margin-right: 10px;
   }
   @media only screen and (max-width: 414px) {
     font-size: 13px;
     letter-spacing: -0.24px;
   }
 `;

const Main = styled.div`
   width: 100%;
   display: flex;
   flex-direction: row;
   justify-content: start;
   align-items: center;
   flex-wrap: wrap;
   cursor: default;
   & .wrap {
     margin-right: 20px;
     margin-bottom: 20px;
   }
   @media only screen and (max-width: 936px) {
     & .wrap {
       margin-right: 10px;
       margin-bottom: 10px;
     }
   }
   @media only screen and (max-width: 414px) {
     justify-content: space-between;
     padding: 0 15px;
   }
   @media only screen and (max-width: 407px) {
     padding: 0;
   }
 `;

const EmptyBox = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   & img {
     max-width: 207px;
     max-height: 207px;
   }
   & p {
     font-size: 23px;
     font-family: Noto Sans CJK KR;
     letter-spacing: -0.69px;
     color: #676767;
   }
 `;