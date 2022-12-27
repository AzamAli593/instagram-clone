import { LOAD_USER_REQ, LOAD_USER_FAIL, LOAD_USER_SUCCESS } from "../constants/userConstants";
import axios from "axios";

export const loadUser = () => async dispatch => {
  try {
    dispatch({ type: LOAD_USER_REQ });
    const { data } = await axios.get("/api/v1/loadUser");
    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.message });
  }
};
