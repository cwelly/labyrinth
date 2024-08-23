// import React, { createContext, useContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import { useAuth } from './LoginContext';

// const SocketContext = createContext();

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const { isAuth } = useAuth();
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     if (isAuth) {
//       const newSocket = io('http://localhost:3001', 
//         {transports: ['websocket', 'polling']}); // 서버 URL 설정
//       setSocket(newSocket);

//       return () => {
//         newSocket.disconnect();
//       };
//     } 
//     // else {
//     //   // 로그아웃 상태일 때 소켓 연결 해제
//     //   if (socket) {
//     //     socket.disconnect();
//     //     setSocket(null);
//     //   }
//     // }
//   }, [isAuth]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
