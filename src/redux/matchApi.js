import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";
import Swal from 'sweetalert2';
import axios from "axios";
import { push, replace } from "redux-first-history";

//Action Types
const REQUEST_MATCHING = "REQUEST_MATCHING";

