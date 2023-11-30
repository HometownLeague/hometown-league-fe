import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";
import { push, replace } from "redux-first-history";

const api = ""

//Action Types
const SET_USER = "SET_USER";
const GET_USER = "GET_USER";
const DELETE_USER = 'DELETE_USER';
const LOG_OUT = "LOG_OUT";

//initialState
const initialState = {
  user: null,
  isLogin: false,
};

//Action Creator
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const deleteUser = createAction(DELETE_USER, (user) => ({ user }));
//회원가입 API
const registerDB = (id, password, nickname, desc) => {
  return function (dispatch, { history }) {
    axios
      .post(`${api}/user/join`, {
        id: id,
        password: password,
        nickname: nickname,
        description: desc,
      },
        { 'X-Requested-With': 'XMLHttpRequest' })
      .then((response) => {
        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          Swal.fire({
            text: "가입이 완료되었습니다!",
            confirmButtonColor: "#FFCC70",
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
    axios
      .post(`/user/login`, {
        id: id,
        password: password,
      })
      .then((response) => {

        if (response.data.responseCode.code === process.env.REACT_APP_API_RES_CODE_SUCESS) {
          dispatch(setUser(response.data.data));
          localStorage.setItem("user", JSON.stringify(response.data.data))
          const cookies = response.headers['set-cookie'];
          let accessToken = null;
          if (cookies && cookies.length > 0) {
            cookies.forEach(cookie => {
              if (cookie.startsWith('SESSION=')) {
                accessToken = cookie.split(';')[0].replace('SESSION=', '');
              }
            });
          }
          console.log("accessToken", accessToken)
          console.log("쿠키", cookies)
          localStorage.setItem("loginToken", accessToken)
          axios.defaults.headers.common[
            'authorization'
          ] = `Bearer ${accessToken}`;
          if (window.location.pathname === "/join") {
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
    axios.delete(`${api}/user/logout`)
      .then((response) => {
        // axios.defaults.headers.common["authorization"] = null;
        // delete axios.defaults.headers.common["authorization"];
        Swal.fire({
          text: '로그아웃 되었습니다.',
          confirmButtonColor: '#FFCC70',
          confirmButtonText: '확인',
        });
      })
      .catch((error) => {
        console.log(error.responseponse);
      });
    localStorage.clear()
    dispatch(logOut())
    dispatch(replace("/"));
  };
};

const getUserDB = (id) => {
  return function (dispatch, { history }) {
    axios({
      method: "get",
      url: `${api}/user/${id}`,
    })
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            dispatch(
              getUser({
                id: response.data.data.id,
                nickname: response.data.data.nickname,
                description: response.data.description,
                // team: response.data.team,
              }),
            );
            break;
          case process.env.REACT_APP_API_RES_CODE_NOT_SESSION:
            localStorage.clear()
            dispatch(logOut())
            Swal.fire({
              text: "로그인 세션이 만료되었습니다",
              confirmButtonColor: '#E3344E',
              confirmButtonText: '확인',
            });
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((error) => {
        console.log(error, error.toJSON());
      });
  };
};

const deleteUserDB = (id) => {
  return function (dispatch, { history }) {
    axios
      .delete(`${api}/user`)
      .then((response) => {
        dispatch(deleteUser());
      })
      .catch((error) => {
        console.log(error.responseponse);
        dispatch(logOut());
        dispatch(replace("/"));
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
    [GET_USER]: (state, action) =>
      produce(state, (draft) => {
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