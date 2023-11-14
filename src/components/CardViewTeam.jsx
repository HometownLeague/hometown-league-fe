import React from 'react';
import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';

import {Trophy } from "../assets/images";
import { Text } from './elements';

function CardViewTeam({teamInfo}) {

  const dispatch = useDispatch();

  return (
    <>
      <CardWrap className='wrap' >
          {/* <Img
            src={teamInfo?.ciPath}
            alt='img'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =Trophy;
            }}
          /> */}
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
  height: 320px;
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
  height: 192px;
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