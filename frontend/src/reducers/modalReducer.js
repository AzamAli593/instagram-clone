export const modalReducer = (
  state = {
    createPostModal: false,
    searchModal: false,
    notificationModal: false,
    mobilePostModal: false
  },
  action
) => {
  switch (action.type) {
    case "TOGGLE_CREATE_POST_MODAL":
      return {
        ...state,
        createPostModal: !state.createPostModal
      };
    case "TOGGLE_SEARCH_MODAL":
      return {
        ...state,
        searchModal: !state.searchModal
      };
    case "TOGGLE_NOTIFICATION_MODAL":
      return {
        ...state,
        notificationModal: !state.notificationModal
      };
    case "TOGGLE_MOBILE_POST_MODAL":
      return {
        ...state,
        mobilePostModal: !state.mobilePostModal
      };
    default:
      return state;
  }
};
