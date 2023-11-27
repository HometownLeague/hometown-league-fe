import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";
import { push, replace } from "redux-first-history";
const api = process.env.REACT_APP_API_URL;
//Action Types
const REQUEST_MATCHING = "REQUEST_MATCHING";
const ACCEPT_MATCHING = "ACCEPT_MATCHING";
const REFUSE_MATCHING = "REFUSE_MATCHING";
const GET_DETAIL_MATCHING = "GET_DETAIL_MATCHING";
const GET_USER_MATCHING = "GET_USER_MATCHING";

const CANCLE_MATCHING = "CANCLE_MATCHING";
const CREATE_MATCHING_RESULT = "CREATE_MATCHING_RESULT";


const initialState = {
  userMatchingList: [],
  detailMatchingList: [],
};
const getUserMatching = createAction(GET_USER_MATCHING, (userMatchingList) => ({ userMatchingList }));
const getDetailMatching = createAction(GET_DETAIL_MATCHING, (matchingRequestId, data) => ({ matchingRequestId, data }));

const requestMatchingDB = (id) => {
  return function (dispatch, { history }) {
    axios.post(`${api}/matching/request`, { teamId: id })
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            Swal.fire({
              text: "상대를 찾기 시작합니다!",
              confirmButtonColor: "#FFCC70",
            })
            dispatch(push("/myMatching"));
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((err) => {
        console.log(err, 'error');
        Swal.fire({
          text: err.error,
          confirmButtonColor: '#E3344E',
          confirmButtonText: '처리중 에러가 발생했습니다.',
        });
        return;
      });
  }
}

const getUserMatchingDB = (id) => {
  return function (dispatch, { history }) {
    axios.get(`${api}/matching/${id}`)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            dispatch(getUserMatching(response.data.data))
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((err) => {
        console.log(err, 'error');
        Swal.fire({
          text: err.error,
          confirmButtonColor: '#E3344E',
          confirmButtonText: err.message,
        });
        return;
      });
  }
}
const getDetailMatchingDB = (matchingRequestId) => {
  return function (dispatch, { history }) {
    axios.get(`${api}/matching/${matchingRequestId}/detail`)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            const data = response.data.data
            dispatch(getDetailMatching(matchingRequestId, data));
            break;
          default:
            Swal.fire({
              text: response.data.responseCode.message,
              confirmButtonColor: "#E3344E",
            });
            break;
        }
      })
      .catch((err) => {
        console.log(err, 'error');
        Swal.fire({
          text: err.error,
          confirmButtonColor: '#E3344E',
          confirmButtonText: err.message,
        });
        return;
      });
  }
}

const acceptMatchingDB = (matchingRequestId) => {
  return function (dispatch, { history }) {
    axios.get(`${api}/matching/accept`, matchingRequestId)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            Swal.fire({
              text: "매칭을 수락하셨습니다",
              confirmButtonColor: "#FFCC70",
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
      .catch((err) => {
        console.log(err, 'error');
        Swal.fire({
          text: err.error,
          confirmButtonColor: '#E3344E',
          confirmButtonText: err.message,
        });
        return;
      });
  }
}

const refuseMatchingDB = (matchingRequestId) => {
  return function (dispatch, { history }) {
    axios.post(`${api}/matching/refuse`, matchingRequestId)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            Swal.fire({
              text: "매칭을 거절하셨습니다",
              confirmButtonColor: "#FFCC70",
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
      .catch((err) => {
        console.log(err, 'error');
        Swal.fire({
          text: err.error,
          confirmButtonColor: '#E3344E',
          confirmButtonText: err.message,
        });
        return;
      });
  }
}

const cancleMatchingDB = (matchingRequestId) => {
  return function (dispatch, { history }) {
    axios.delete(`${api}/matching/${matchingRequestId}`)
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            Swal.fire({
              text: "매칭을 취소하셨습니다",
              confirmButtonColor: "#FFCC70",
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
      .catch((err) => {
        console.log(err, 'error');
        Swal.fire({
          text: err.error,
          confirmButtonColor: '#E3344E',
          confirmButtonText: err.message,
        });
        return;
      });
  }
}

const submitMatchingResultDB = (matchingRequestId, ourTeamScore, otherTeamScore) => {
  return function (dispatch, { history }) {
    axios.post(`${api}/matching/result`, { matchingRequestId: matchingRequestId, ourTeamScore: ourTeamScore, otherTeamScore: otherTeamScore })
      .then((response) => {
        switch (response.data.responseCode.code) {
          case process.env.REACT_APP_API_RES_CODE_SUCESS:
            Swal.fire({
              text: "경기 결과 입력 완료",
              confirmButtonColor: "#FFCC70",
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
      .catch((err) => {
        console.log(err, 'error');
        Swal.fire({
          text: err.error,
          confirmButtonColor: '#E3344E',
          confirmButtonText: err.message,
        });
        return;
      });
  }
}

export default handleActions(
  {
    [GET_USER_MATCHING]: (state, action) =>
      produce(state, (draft) => {
        draft.userMatchingList = action.payload.userMatchingList;
      }),
    [GET_DETAIL_MATCHING]: (state, action) =>
      produce(state, (draft) => {
        if (draft.detailMatchingList && draft.detailMatchingList.length > 0) {
          let object = draft.detailMatchingList.find(m => m.matchingRequestId === action.payload.matchingRequestId);
          if (object) object.data = action.payload.data;
          else draft.detailMatchingList.unshift({ matchingRequestId: action.payload.matchingRequestId, data: action.payload.data });
        }
        else draft.detailMatchingList = [{ matchingRequestId: action.payload.matchingRequestId, data: action.payload.data }];
      }),
  },
  initialState
);

const actionCreators = {
  getUserMatchingDB,
  refuseMatchingDB,
  requestMatchingDB,
  getDetailMatchingDB,
  acceptMatchingDB,
  cancleMatchingDB,
  submitMatchingResultDB
};
export { actionCreators };