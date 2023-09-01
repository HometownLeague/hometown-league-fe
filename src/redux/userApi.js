import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";

//TODO - url 재 설정하기
const API_URL='218.232.175.4';

//Action Types
const REGISTER_SUCCESS = "REGISTER_SUCCESS";
const REGISTER_FAIL = "REGISTER_FAIL";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAIL = "LOGIN_FAIL";
const SET_USER = "SET_USER";
const GET_USER = "GET_USER";
const DELETE_USER = 'DELETE_USER';
const LOG_OUT = "LOG_OUT";

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

//회원가입 API
const registerDB = (id, password,img) => {
  return function ({history}) {
    axios({
      method: "post",
      url: "API_URL/user/register",
      data: {
        id: id,
        password: password,
        location:[],
        image:img,
        team:[],
      },
    })
      .then((response) => {
        if (response.data.msg === "success") {
          Swal.fire({
            text: "가입이 완료되었습니다!",
            confirmButtonColor: "#E3344E",
          }).then((responseult) => {
            if (responseult.isConfirmed) {
              history.push("/");
            }
          });
        } else {
          console.log("가입실패");
        }
      })
      .catch((error) => {
        console.log(error, error.toJSON());
      });
  };
};

//로그인 API
const loginDB = (id, password) => {
  return function (dispatch,{history}) {
    axios({
      method: "post",
      url: "API_URL/user/login",
      data: {
        id: id,
        password: password,
      },
    })
      .then((response) => {
        if (response.data.msg === "success") {
          const userInfo = {
            name: response.data.id.split("@")[0],
          };
          dispatch(setUser(userInfo));
        const accessToken = response.data.token;
        if (accessToken) {
          localStorage.setItem("user", JSON.stringify(userInfo));
        }
        history.push("/");
      }else {
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
    dispatch(logOut());
    Swal.fire({
      text: '로그아웃 되었습니다.',
      confirmButtonColor: '#7F58EC',
      confirmButtonText: '확인',
    });
    history.replace("/");
  };
};
const getUserDB = () => {
  return function (dispatch, { history }) {
    axios({
      method: "get",
      url: "API_URL/user/get",
    })
      .then((response) => {
        dispatch(
          getUser({
            id: response.data.id,
            image: response.data.imageUrl,
            locations: response.data.locations,
            team: response.data.team,
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

const deleteUserDB = () => {
  return function (dispatch, { history }) {
    axios
      .delete(`/API_URL/user`)
      .then((response) => {
        dispatch(deleteUser());
      })
      .catch((error) => {
        console.log(error.responseponse);
        dispatch.logOut();
        history.replace('/');
      });
  };
};
// TODO - 유저 정보 수정
//로그인 유지 API
//클라이언트 로컬저장소에 토큰이 존재하는 경우
//서버에서 토큰을 받아 유효성 검증 후 유효하다면 유저 정보를 주어 자동 로그인
// const loginCheckDB = () => {
//   return function (dispatch, getState, { history }) {
//     const token = getCookie("is_login");
//     console.log(token);
//     axios({
//       method: "post",
//       url: "API_URL/user/check",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         console.log(response.data);
//         dispatch(
//           setUser({
//             id: response.data.id,
//           })
//         );
//       })
//       .catch((error) => {
//         console.log(error.code, error.message);
//       });
//   };
// };

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
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
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