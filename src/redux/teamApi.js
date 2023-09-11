import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";

import { API_URL } from '../lib/constants'

//Action Types
const GET_TEAM = "GET_TEAM";
const CREATE_TEAM = "CREATE_TEAM";
const DELETE_TEAM = "DELETE_TEAM";
const ADD_MEMBER = "ADD_MEMBER";
const LOADING = "LOADING";
const GET_RANK = "GET_RANK";

const initialState = {
  team_list: {
    joined: [{
      "id": 1,
      "name": "testname",
      "location": ["서울시노원구"],
      "description": "test소개글",
      "logo": "imageUrl",
      "time": [["월", "1012"], ["화", "2021"]],
      "captin": "testid",
      "rank": "unrank",
    }],
    unjoined: [],
  },
  teamId: null,
  rank: [],
  isLoading: false,
};

const getTeam = createAction(GET_TEAM, (team_list) => ({ team_list }));
const createTeam = createAction(CREATE_TEAM, (team) => ({ team }));
const deleteTeam = createAction(DELETE_TEAM, (team) => ({ team }));
const addMember = createAction(ADD_MEMBER, (team) => ({ team }));
const loading = createAction(LOADING, (isLoading) => ({ isLoading }));
//const getRank = createAction(GET_RANK, (rank) => ({ rank }));

const getTeamDB = () => {
  return function (dispatch, { history }) {
    dispatch(loading(true));
    axios
      .get(`/team`)
      .then((response) => {
        switch (response.data.responseCode === "0000") {
          case "success":
            dispatch(getTeam(response.data));
            break;
          case "not_login":
            history.push("/");
            Swal.fire({
              text: "로그인 만료되었습니다.",
              confirmButtonColor: "rgb(118, 118, 118)",
            });
            break;
          default:
            Swal.fire({
              text: "팀 불러오기에 실패했습니다. ",
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((err) => console.log(err));
  };
};
const createTeamDB = (teamInfo) => {
  return function (dispatch, { history }) {
    axios
      .post(`/team`, teamInfo)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case "0000":
            dispatch(createTeam(teamInfo));
            break;
          //FIXME - case 만료 설정
          case "not_login":
            Swal.fire({
              text: "로그인 만료되었습니다.",
              confirmButtonColor: "rgb(118, 118, 118)",
            });
            history.push("/");
            break;
          default:
            Swal.fire({
              text: "팀 생성에 실패했습니다. ",
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((err) => console.log(err));
  };
};

const deleteTeamDB = (team) => {
  return function (dispatch, { history }) {
    Swal.fire({
      icon: "warning",
      title: "정말 팀을 삭제하시겠어요?",
      showCancelButton: true,
      confirmButtonColor: "#E2344E",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      cancelButtonColor: "rgb(118, 118, 118)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/team/${team.teamId}`)
          .then((response) => {
            switch (response.data.responseCode.code) {
              case "0000":
                Swal.fire("삭제 완료!", "팀이 삭제되었습니다.", "success");
                dispatch(deleteTeam(team));
                window.location.href = '/team';
                break;
              //FIXME - case 만료 설정
              case "2":
                Swal.fire({
                  text: "로그인 만료되었습니다.",
                  confirmButtonColor: "rgb(118, 118, 118)",
                });
                history.push("/");
                break;
              case "2003":
                Swal.fire({
                  text: "존재하지 않는 팀 ID 입니다.",
                  confirmButtonColor: "rgb(118, 118, 118)",
                });
                history.push("/");
                break;
              case "2004":
                Swal.fire({
                  text: "팀의 주장만 삭제 할 수 있습니다.",
                  confirmButtonColor: "rgb(118, 118, 118)",
                });
                history.push("/");
                break;
              default:
                Swal.fire({
                  text: "팀 삭제에 실패했습니다. ",
                  confirmButtonColor: "#E3344E",
                });
                break;
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };
};

const addMemberDB = (team) => {
  return function (dispatch, { history }) {
    axios
      .post(`/team/${team.teamId}`)
      .then((res) => {
        switch (res.data.message) {
          case "success":
            dispatch(addMember(team));
            Swal.fire("가입 완료!");
            break;
          case "not_login":
            Swal.fire({
              text: "로그인 만료되었습니다.",
              confirmButtonColor: "rgb(118, 118, 118)",
            });
            history.push("/");
            break;
          default:
            Swal.fire({
              text: "가입에 실패했습니다. ",
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((err) => console.log(err));
  };
};

export default handleActions(
  {
    [GET_TEAM]: (state, action) =>
      produce(state, (draft) => {
        draft.team_list = action.payload.team_list;
        draft.isLoading = false;
      }),
    [CREATE_TEAM]: (state, action) =>
      produce(state, (draft) => {
        draft.team_list.joined.unshift(action.payload.team);
      }),
    [DELETE_TEAM]: (state, action) =>
      produce(state, (draft) => {
        draft.team_list.joined = draft.team_list.joined.filter(
          (team) => team.teamId !== action.payload.team.teamId
        );
      }),
    [ADD_MEMBER]: (state, action) =>
      produce(state, (draft) => {
        draft.team_list.joined.unshift(action.payload.team);
        draft.team_list.unjoined = draft.team_list.unjoined.filter(
          (team) => team.teamId !== action.payload.team.teamId
        );
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.isLoading = action.payload.isLoading;
      }),
  },
  initialState
);

const actionCreators = {
  getTeam,
  createTeam,
  deleteTeam,
  addMember,
  getTeamDB,
  createTeamDB,
  deleteTeamDB,
  addMemberDB,
  loading,

};

export { actionCreators };