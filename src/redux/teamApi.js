import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";

//Action Types
const GET_TEAM = "GET_TEAM";
const CREATE_TEAM = "CREATE_TEAM";
const DELETE_TEAM = "DELETE_TEAM";
const ADD_MEMBER = "ADD_MEMBER";
const LOADING = "LOADING";
const GET_USER_TEAMS = "GET_USER_TEAMS";
const GET_RANK = "GET_RANK";

const initialState = {
  teamList: [],
  userTeams: [],
  rank: [],
  isLoading: false,
};

const getTeam = createAction(GET_TEAM, (teamList) => ({ teamList }));
const createTeam = createAction(CREATE_TEAM, (team) => ({ team }));
const deleteTeam = createAction(DELETE_TEAM, (team) => ({ team }));
const addMember = createAction(ADD_MEMBER, (team) => ({ team }));
const loading = createAction(LOADING, (isLoading) => ({ isLoading }));
const getUserTeams = createAction(GET_USER_TEAMS, (userTeams) => ({ userTeams }));

//const getRank = createAction(GET_RANK, (rank) => ({ rank }));

const getTeamDB = (teamId) => {
  return function (dispatch, { history }) {
    dispatch(loading(true));
    axios
      .get(`/team/${teamId}`)
      .then((response) => {
        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          dispatch(getTeam(response.data));
        }
        else if (response.data.responseCode.code === "1004") {
          history.push("/");
          Swal.fire({
            text: "로그인 만료되었습니다.",
            confirmButtonColor: "rgb(118, 118, 118)",
          });
        } else {
          Swal.fire({
            text: "팀 불러오기에 실패했습니다. ",
            confirmButtonColor: "#E3344E",
          });
        }
      })
      .catch((err) => console.log(err));
  };
};

const getUserTeamsDB = (id) => {
  return function (dispatch, { history }) {
    axios({
      method: "get",
      url: `/user/team`,
      data: {
        id: id
      }
    }).then((response) => {
      if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
        dispatch(getUserTeams());
        localStorage.setItem("userTeams", response.data.data);
      } else if (response.data.responseCode.code === "1005") {
        Swal.fire({
          text: response.data.responseCode.message,
          confirmButtonColor: "#E3344E",
        });
      }
    })
      .catch((error) => {
        console.log(error);
      });
  }
}
const createTeamDB = (teamInfo) => {
  return function (dispatch, { history }) {
    axios
      .post(`/team`, teamInfo)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            dispatch(createTeam(teamInfo));
            Swal.fire({
              text: "새로운 팀을 만들었습니다!",
              confirmButtonColor: "rgb(118, 118, 118)",
            })
            break;
          case '2001':
            Swal.fire({
              text: "시간 입력에 실패했습니다.",
              confirmButtonColor: "#E3344E",
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

const deleteTeamDB = (teamId) => {
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
          .delete(`/team/${teamId}`)
          .then((response) => {
            switch (response.data.responseCode.code) {
              case "0000":
                Swal.fire("삭제 완료!", "팀이 삭제되었습니다.", "success");
                dispatch(deleteTeam(teamId));
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
        draft.teamList = action.payload.teamList;
        draft.isLoading = false;
      }),
    [GET_USER_TEAMS]: (state, action) => produce(state, (draft) => {
      draft.userTeams = action.payload.userTeams;
      draft.isLoading = false;
    }),
    [CREATE_TEAM]: (state, action) =>
      produce(state, (draft) => {
        draft.userTeams.unshift(action.payload.team);
        draft.teamList = draft.teamList.filter(
          (team) => team.teamId !== action.payload.team.teamId
        );
      }),
    [DELETE_TEAM]: (state, action) =>
      produce(state, (draft) => {
        Swal.fire({
          text: '팀이 삭제 되었습니다.',
          confirmButtonColor: '#7F58EC',
          confirmButtonText: '확인',
        });
        draft.teamList = draft.teamList.filter(
          (team) => team.teamId !== action.payload.team.teamId
        );
      }),
    [ADD_MEMBER]: (state, action) =>
      produce(state, (draft) => {
        //TODO - 가입 시키기에서 바뀔 state
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
  getUserTeams,
  getUserTeamsDB,
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