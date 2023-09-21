import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";
import { push, replace } from "redux-first-history";
import { actionCreators as userAction } from "./userApi"
//Action Types
const GET_QUERY_TEAM = "GET_QUERY_TEAM";
const GET_TEAM_DETAIL = "GET_TEAM_DETAIL";
const CREATE_TEAM = "CREATE_TEAM";
const DELETE_TEAM = "DELETE_TEAM";
const ADD_MEMBER = "ADD_MEMBER";
const LOADING = "LOADING";
const GET_USER_TEAMS = "GET_USER_TEAMS";
const UPDATE_TEAM = "UPDATE_TEAM";
const UPDATE_TEAM_OWNER = "UPDATE_TEAM_OWNER";
const LEAVE_TEAM = 'LEAVE_TEAM';
const GET_RANK = "GET_RANK";

const initialState = {
  teamList: [],
  userTeams: [],
  rank: [],
  isLoading: false,
};

const getQueryTeam = createAction(GET_QUERY_TEAM, (teamList) => ({ teamList }));
const getUserTeams = createAction(GET_USER_TEAMS, (userTeams) => ({ userTeams }));
const getTeamDetail = createAction(GET_TEAM_DETAIL, (team) => ({ team }));
const createTeam = createAction(CREATE_TEAM, (team) => ({ team }));
const deleteTeam = createAction(DELETE_TEAM, (team) => ({ team }));
const addMember = createAction(ADD_MEMBER, (team) => ({ team }));
const updateTeam = createAction(UPDATE_TEAM, (team) => ({ team }));
const updateTeamOwner = createAction(UPDATE_TEAM_OWNER, (team) => ({ team }));
const leaveTeam = createAction(LEAVE_TEAM, (team) => ({ team }));
const loading = createAction(LOADING, (isLoading) => ({ isLoading }));


//const getRank = createAction(GET_RANK, (rank) => ({ rank }));

// 쿼리에 맞는 팀목록 조회
const getQueryTeamDB = (id) => {
  // return function (dispatch, { history }) {
  //   dispatch(loading(true));
  //   axios
  //     .get(`/team/${id}`)
  //     .then((response) => {
  //       if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
  //         dispatch(getQueryTeam(response.data.data));
  //       }
  //       else if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_NOT_SESSION) {
  //         dispatch(replace("/"));
  //         Swal.fire({
  //           text: "로그인 만료되었습니다.",
  //           confirmButtonColor: "rgb(118, 118, 118)",
  //         });
  //       } else {
  //         Swal.fire({
  //           text: "팀 상세 정보를 불러오기에 실패했습니다. ",
  //           confirmButtonColor: "#E3344E",
  //         });
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };
};

//SECTION - 유저의 팀 정보 조회. 쿠키로 로그인 세션이 넘어감.
const getUserTeamsDB = () => {
  return function (dispatch, { history }) {
    axios.get(`/user/team`)
      .then((response) => {
        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          dispatch(getUserTeams(response.data.data));
        } else if (response.responseCode.code === process.env.REACT_APP_API_RES_CODE_NOT_SESSION) {
          dispatch(replace("/"));
          Swal.fire({
            text: "세션 정보가 없습니다.",
            confirmButtonColor: "rgb(118, 118, 118)",
          });
        } else {
          Swal.fire({
            text: "나의 팀 불러오기에 실패했습니다. ",
            confirmButtonColor: "#E3344E",
          });
        }
      })
      .catch((error) => {
        console.log(error);

      });
  }
}
//SECTION -팀 상세 정보 조회
const getTeamDetailDB = (id) => {
  return function (dispatch, { history }) {
    dispatch(loading(true));
    axios
      .get(`/team/${id}`)
      .then((response) => {
        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          dispatch(getTeamDetail(response.data.data));
        }
        else if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_NOT_SESSION) {
          dispatch(replace("/"));
          dispatch(userAction.loginCheckDB());
          Swal.fire({
            text: "세션 정보가 없습니다.",
            confirmButtonColor: "rgb(118, 118, 118)",
          });
        } else {
          Swal.fire({
            text: "팀 상세 정보를 불러오기에 실패했습니다. ",
            confirmButtonColor: "#E3344E",
          });
        }
      })
      .catch((err) => console.log(err));
  };
};
//SECTION -팀 생성
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
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((err) => console.log(err));
  };
};

const deleteTeamDB = (id) => {
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
          .delete(`/team/${id}`)
          .then((response) => {
            switch (response.data.responseCode.code) {
              case process.env.REACT_APP_API_RES_CODE_SUCESS:
                Swal.fire("삭제 완료!", "팀이 삭제되었습니다.", "success");
                dispatch(deleteTeam(id));
                history.replace("/teamManagement");
                break;
              default:
                Swal.fire({
                  text: response.data.responseCode.message,
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
const updateTeamDB = (bData, tData, lData) => {
  return function (dispatch, { history }) {
    axios
      .patch(`/team`, bData)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            dispatch(updateTeam(response.data.data));
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            history.push("/");
            break;
        }
      })
      .catch((err) => console.log(err));
    axios
      .put(`/team/play-time`, tData)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            dispatch(updateTeam(response.data.data));
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            history.push("/");
            break;
        }
      })
      .catch((err) => console.log(err));
    axios
      .put(`/team/play-location`, lData)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            dispatch(updateTeam(response.data.data));
            Swal.fire({
              text: "새로운 팀을 만들었습니다!",
              confirmButtonColor: "rgb(118, 118, 118)",
            })
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            history.push("/");
            break;
        }
      })
      .catch((err) => console.log(err));
  };
};
//팀에 멤버 추가하기
const addMemberDB = (teamId, joinUserId) => {
  return function (dispatch, { history }) {
    axios
      .post(`/team/accept`, {
        teamId: teamId,
        joinRequestId: joinUserId
      })
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            //dispatch(addMember(team));
            Swal.fire("가입 완료!");
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            history.push("/");
            break;
        }
      })
      .catch((err) => console.log(err));
  };
};
//팀 탈퇴하기
const leaveTeamDB = (teamId) => {
  return function (dispatch, { history }) {
    Swal.fire({
      icon: "warning",
      title: "정말 팀을 나가시겠어요?",
      showCancelButton: true,
      confirmButtonColor: "#E2344E",
      confirmButtonText: "나가기",
      cancelButtonText: "취소",
      cancelButtonColor: "rgb(118, 118, 118)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/team/`)
          .then((response) => {
            switch (response.data.responseCode.code) {
              case process.env.REACT_APP_API_RES_CODE_SUCESS:
                Swal.fire("성공적으로 탈퇴하셨습니다", "success");
                dispatch(leaveTeam(teamId));
                history.replace("/teamManagement");
                break;
              default:
                Swal.fire({
                  text: response.data.responseCode.message,
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
const updateTeamOwnerDB = (teamId, newOwnerId) => {
  return function (dispatch, { history }) {
    axios
      .patch(`/team/${teamId}/owner`, {
        userId: newOwnerId
      })
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            dispatch(updateTeamOwner(teamId, newOwnerId));
            Swal.fire("주장 변경 완료");
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((err) => console.log(err));
  };
}
//draft는 현재 값이 복사된 새로운 state  
export default handleActions(
  {
    [GET_USER_TEAMS]: (state, action) =>
      produce(state, (draft) => {
        draft.userTeams = action.payload.userTeams;
        draft.isLoading = false;
      }),
    [GET_TEAM_DETAIL]: (state, action) =>
      produce(state, (draft) => {
        const { team } = action.payload;
        //TODO - 빈 배열로 들어가게 됨..
        draft.userTeams = draft.userTeams.map(t => {
          if (t.id === team.id) return {
            ...team
          }
          return t
        })
        draft.isLoading = false;
      }),
    [CREATE_TEAM]: (state, action) =>
      produce(state, (draft) => {
        draft.userTeams.unshift(action.payload.team);
      }),
    [DELETE_TEAM]: (state, action) =>
      produce(state, (draft) => {
        let index = draft.teamList.findIndex((t) => t.id === action.payload.team.id);
        draft.teamList.splice(index, 1);
        index = draft.userTeams.findIndex((t) => t.id === action.payload.team.id);
        draft.userTeams.splice(index, 1);
      }),
    [LEAVE_TEAM]: (state, action) =>
      produce(state, (draft) => {
        const index = draft.userTeams.findIndex((t) => t.id === action.payload.team.id);
        draft.userTeams.splice(index, 1);
      }),
    [ADD_MEMBER]: (state, action) =>
      produce(state, (draft) => {
        //TODO - 가입 시키기에서 바뀔 state
      }),
    [UPDATE_TEAM]: (state, action) =>
      produce(state, (draft) => {
        const { teamData } = action.payload;
        draft.userTeams = draft.userTeams.map(t => {
          if (t.id === teamData.id) return {
            ...teamData
          }
          return t
        })
      }),
    [UPDATE_TEAM_OWNER]: (state, action) =>
      produce(state, (draft) => {
        const { teamId, newOwnerId } = action.payload;
        draft.userTeams = draft.userTeams.map(t => {
          if (t.id === teamId) return {
            ...t,
            ownerId: newOwnerId
          }
          return t
        })
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.isLoading = action.payload.isLoading;
      }),
  },
  initialState
);

const actionCreators = {
  getQueryTeam,
  getQueryTeamDB,
  getUserTeams,
  getUserTeamsDB,
  getTeamDetail,
  getTeamDetailDB,
  createTeam,
  createTeamDB,
  deleteTeam,
  deleteTeamDB,
  addMember,
  addMemberDB,
  updateTeamDB,
  updateTeamOwnerDB,
  leaveTeamDB,
  loading,
};

export { actionCreators };