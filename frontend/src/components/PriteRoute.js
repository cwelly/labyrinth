import React from "react";
import {  Navigate } from "react-router-dom";
import { useAuth } from "./LoginContext";

const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
