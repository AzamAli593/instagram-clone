import { LOAD_USER_FAIL, LOAD_USER_REQ, LOAD_USER_SUCCESS } from "../constants/userConstants";

export const userReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case LOAD_USER_REQ:
      return {
        ...state,
        userLoading: true,
        isAuthenticated: false
      };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        userLoading: false,
        isAuthenticated: true,
        user: action.payload
      };
    case LOAD_USER_FAIL:
      return {
        ...state,
        userLoading: false,
        isAuthenticated: false,
        error: action.payload
      };

    default:
      return state;
  }
};
