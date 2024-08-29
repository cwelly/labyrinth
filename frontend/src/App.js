import React from "react";
import Canva from "./components/Canvas";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import GameRoom from "./components/GameRoom";
import LandingPage from "./components/LandingPage";
import { LoginProvider } from "./components/LoginContext";
import PrivateRoute from "./components/PriteRoute"; 
import { io } from "socket.io-client";
const netAddress = "192.168.2.254";
const socket = io("http://"+netAddress+":3001", {
  transports: ["websocket", "polling"],
});

function App() {
  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <LoginProvider netAddress={netAddress}> 
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />}></Route>
              <Route
                path="/GameRoom"
                element={
                  <PrivateRoute>
                    <GameRoom socket={socket} netAddress={netAddress} />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/Canva"
                element={
                  <PrivateRoute>
                    <Canva socket={socket} netAddress={netAddress} />
                  </PrivateRoute>
                }
              ></Route>
              <Route path="*" element={<ErrorPage />}></Route>
            </Routes>
          </BrowserRouter> 
      </LoginProvider>
    </div>
  );
}

export default App;
