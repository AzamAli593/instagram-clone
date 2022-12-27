import Cookies from "js-cookie";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function RegisterProtected({ children }) {
  const { isAuthenticated, userLoading } = useSelector(state => state.user);

  if (!Cookies.get("tempToken")) {
    return <Navigate replace to="/" />;
  }
  if (!userLoading) {
    if (isAuthenticated) {
      return <Navigate replace to="/home" />;
    }
  }
  return children;
}

export default RegisterProtected;
