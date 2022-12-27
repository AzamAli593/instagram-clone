import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function LoginProtected({ children }) {
  const { isAuthenticated, userLoading } = useSelector(state => state.user);

  if (!userLoading) {
    if (isAuthenticated) {
      return <Navigate replace to="/home" />;
    }
  }
  return children;
}

export default LoginProtected;
