import React   from "react";
import Canva from "./components/Canvas";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import GameRoom from "./components/GameRoom";
import LandingPage from "./components/LandingPage";
import { LoginProvider } from "./components/LoginContext";
import PrivateRoute from "./components/PriteRoute";
function App() {
  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/GameRoom" element={
              <PrivateRoute>
                <GameRoom />
              </PrivateRoute>
              }></Route>
            <Route path="/Canva" element={<Canva />}></Route>
            <Route path="*" element={<ErrorPage />}></Route>
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </div>
  );
}

export default App;
