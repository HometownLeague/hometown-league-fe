import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as teamActions } from "../redux/teamApi";
import { Text, Grid, Image, Button } from "../components/elements";
import swal from "sweetalert2";
import { history } from "../redux/configStore";
import { Link } from 'react-router-dom';

function TeamProfile(props) {

  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();


  return (
    <>

      {/* 왼쪽 바 */}

      {/* 점수, 팀 설명 header */}
      {/* 선수단 div*/}
      {/* 공지사항, 일정 div */}


    </>
  );
}


export default TeamProfile