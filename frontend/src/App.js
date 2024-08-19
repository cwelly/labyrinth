import React, { useState } from "react";
import Canva from "./components/Canvas";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import GameRoom from "./components/GameRoom";
import LandingPage from "./components/LandingPage";
function App() {
  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}></Route>
          <Route path="/GameRoom" element={<GameRoom/>}></Route>
          <Route path="/Canva" element={<Canva/>}></Route>
          <Route path="*" element={<ErrorPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
