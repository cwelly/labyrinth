import React, { useEffect } from "react";
import {  Navigate , useLocation } from "react-router-dom";
import { useAuth } from "./LoginContext";

const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  const location  = useLocation();
  const {localAuth}  = location.state || {};
  if (!isAuth&&!localAuth) {
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;
