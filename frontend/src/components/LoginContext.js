import React, { createContext, useState,useContext } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [loginedNickname, setLoginedNickname] = useState(null);
  const [isAuth ,  setAuth]  = useState(false);
  const login = (nickname) => {
    // 여기서 서버와 통신
    const mockUser = { nickname };
    setLoginedNickname(mockUser);
    setAuth(true);
  };
  const logout = () => {
    setLoginedNickname(null);
    setAuth(false)
  };

  return (
    <LoginContext.Provider value={{isAuth, loginedNickname, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useAuth = () => useContext(LoginContext);