import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [loginedNickname, setLoginedNickname] = useState(() => {
    const savedNickname = localStorage.getItem("nickname");
    return savedNickname ? JSON.parse(savedNickname) : null;
  });
  const [loginedSpectator, setLoginedSpectator] = useState(() => {
    const savedSpectator = localStorage.getItem("spectator");
    return savedSpectator ? JSON.parse(savedSpectator) : false;
  });
  const [isAuth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("isAuth");
    return savedAuth ? JSON.parse(savedAuth) : false;
  });
  
  const [error, setError] = useState(null); // 로그인 오류 상태 추가
  useEffect(() => {
    localStorage.setItem('nickname', JSON.stringify(loginedNickname));
    localStorage.setItem('isAuth', JSON.stringify(isAuth));
    localStorage.setItem('spectator',JSON.stringify(loginedSpectator))
  }, [loginedNickname,isAuth,loginedSpectator]);
  const login= async (nickname) => {
    try {
      // 서버에 로그인 요청을 보냅니다
      const response = await axios.post('http://localhost:3001/login', { nickname });
      
      if (response.data.success&&response.data.loginedNickname) {
        // 로그인 성공 시
        setLoginedNickname(response.data.loginedNickname);
        setAuth(true); 
        setError(null); // 로그인 오류를 초기화
        return {localAuth : true , player:true,whosTurn:response.data.whosTurn};
      } else if(response.data.spectator){
        // 관전자 로그인 성공 시
        setLoginedNickname("");
        setLoginedSpectator(response.data.spectator)
        setAuth(true); 
        setError(null); // 로그인 오류를 초기화
        return {localAuth : true , player:false,whosTurn:response.data.whosTurn};
      }
      else {
        // 로그인 실패 시
        setError(response.data.message); // 실패 메시지 설정
        setLoginedNickname(null);
        setAuth(false);
        localStorage.removeItem('nickname');
        localStorage.setItem('isAuth', JSON.stringify(false));
        return {localAuth : false , player:false};
      }
    } catch (error) {
      // 네트워크 오류 등
      setError('로그인 중 오류 발생');
      setLoginedNickname(null);
      setAuth(false);
      localStorage.removeItem('nickname');
      localStorage.setItem('isAuth', JSON.stringify(false));
      return {localAuth : false , player:false};
    }
  };
  const logout = () => {
    setLoginedNickname(null);
    setAuth(false);
    localStorage.removeItem('nickname'); // 로컬 스토리지에서 닉네임 삭제
    localStorage.removeItem('isAuth'); // 로컬 스토리지에서 인증 상태 삭제
  };

  return (
    <LoginContext.Provider value={{ isAuth, loginedNickname,loginedSpectator, login, logout ,error}}>
      {children}
    </LoginContext.Provider>
  );
};

export const useAuth = () => useContext(LoginContext);
