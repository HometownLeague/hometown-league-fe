import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";
import { push, replace } from "redux-first-history";

//import { API_URL } from '../lib/constants'

//Action Types
const SET_USER = "SET_USER";
const GET_USER = "GET_USER";
const DELETE_USER = 'DELETE_USER';
const LOG_OUT = "LOG_OUT";

const SET_LOGINTOKEN = "SET_LOGINTOKEN";

//initialState
const initialState = {
  user: null,
  is_login: false,
};

//Action Creator
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const deleteUser = createAction(DELETE_USER, (user) => ({ user }));
const setLoginToken = createAction(SET_LOGINTOKEN, (user) => ({}));

//회원가입 API
const registerDB = (id, password, nickname, desc) => {
  return function (dispatch, { history }) {
    axios({
      method: "post",
      url: `/user/join`,
      data: {
        id: id,
        password: password,
        nickname: nickname,
        description: desc,
      },
    })
      .then((response) => {
        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          Swal.fire({
            text: "가입이 완료되었습니다!",
            confirmButtonColor: "#E3344E",
          }).then((responseult) => {
            if (responseult.isConfirmed) {
              dispatch(push("/"))
            }
          });
        } else if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_ERROR) {
          Swal.fire({
            text: "처리중 에러가 발생했습니다.",
            confirmButtonColor: "#E3344E",
          })
        } else {
          Swal.fire({
            text: "이메일과 닉네임을 확인하세요.",
            confirmButtonColor: "#E3344E",
          })
        }
      })
      .catch((error) => {
        console.log(error, error.toJSON());
      });
  };
};

//로그인 API
const loginDB = (id, password) => {
  return function (dispatch, { history }) {
    axios({
      method: "post",
      url: `/user/login`,
      data: {
        id: id,
        password: password,
      },
    })
      .then((response) => {
        if (response.data.responseCode.code === "0000") {
          dispatch(setUser(response.data.data));
          //TODO - 로그인 토큰 설정
          console.log(response.headers.token)
          // const accessToken=
          localStorage.setItem("user", JSON.stringify(response.data.data));
          localStorage.setItem("loginToken", response.headers)
          if (window.location.pathname == "/join") {
            dispatch(replace("/"))
          }
        } else {
          Swal.fire({
            text: "아이디 혹은 비밀번호를 확인해주세요.",
            confirmButtonColor: "#E3344E",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

const logoutDB = () => {
  return function (dispatch, { history }) {
    localStorage.removeItem("user");
    localStorage.removeItem("loginToken");
    dispatch(logOut());
    Swal.fire({
      text: '로그아웃 되었습니다.',
      confirmButtonColor: '#7F58EC',
      confirmButtonText: '확인',
    });
    dispatch(replace("/"));
  };
};
const getUserDB = (id) => {
  return function (dispatch, { history }) {
    axios({
      method: "get",
      url: `/user/${id}`,
    })
      .then((response) => {
        dispatch(
          getUser({
            id: response.data.data.id,
            nickname: response.data.data.nickname,
            description: response.data.description,
            // team: response.data.team,
          }),
        );
      })
      .catch((err) => {
        console.log(err, 'error');
        Swal.fire({
          text: err.error,
          confirmButtonColor: '#7F58EC',
          confirmButtonText: '확인',
        });
        return;
      });
  };
};

const deleteUserDB = (id) => {
  return function (dispatch, { history }) {
    axios({
      method: "delete",
      url: `/user`,
    })
      .then((response) => {
        dispatch(deleteUser());
      })
      .catch((error) => {
        console.log(error.responseponse);
        dispatch.logOut();
        dispatch(replace("/"));
      });
  };
};

// TODO - 유저 정보 수정
//로그인 유지 API
//클라이언트 로컬저장소에 토큰이 존재하는 경우
//서버에서 토큰을 받아 유효성 검증 후 유효하다면 유저 정보를 주어 자동 로그인
const loginCheckDB = () => {
  return function (dispatch, getState, { history }) {
    const token = localStorage.getItem("loginToken");
    console.log(token);
    axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
    axios({
      method: "post",
      url: "API_URL/user/check",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        dispatch(
          setUser({
            id: response.data.id,
          })
        );
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };
};

//reducer
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {

        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {
      draft.user = action.payload.user;
      draft.is_login = true;

    }),

  },
  initialState
);

//action creator export
const actionCreators = {
  setUser,
  getUser,
  getUserDB,
  logOut,
  logoutDB,
  registerDB,
  loginDB,
  deleteUser,
  deleteUserDB,
};

export { actionCreators };