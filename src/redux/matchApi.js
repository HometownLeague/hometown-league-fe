import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";
import { push, replace } from "redux-first-history";

//Action Types
const REQUEST_MATCHING = "REQUEST_MATCHING";
const ACCEEPT_MATCHING = "ACCEEPT_MATCHING";
const REFUSE_MATCHING = "REFUSE_MATCHING";
const GET_TEAM_MATCHING = "GET_TEAM_MATCHING";
const CANCLE_MATCHING = "CANCLE_MATCHING";
const CREATE_MATCHING_RESULT = "CREATE_MATCHING_RESULT";


const initialState = {
  matchingList: [],
};

