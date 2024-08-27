import React, { useEffect } from "react";
import {  Navigate } from "react-router-dom";
import { useAuth } from "./LoginContext";

const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  useEffect(()=>{ 
  },[isAuth])
  if (!isAuth) {
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;
