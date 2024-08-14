import { Canvas } from "@react-three/fiber";
import {
  Grid,
  GizmoHelper,
  Text,
  Box,
  ScreenSpace,
  Html,
  KeyboardControls,
} from "@react-three/drei";
import GameObejcts from "./GameObject";
import Camera from "./Camera";
import React, { forwardRef, Suspense, useRef, useState } from "react";
import UserInterface from "./UserInteface";

function Canva() {
  const grid_size = [100, 100];
  const grid_position = [0, 0, 0];
  const cameraRef = useRef();
  const gameObjectRef = useRef();
  // 타일확정 버튼 state
  const [tileConfirmButton, setTileConfirmButton] = useState(false);
  // 게임의 현재 상태(턴과는 상관없는 )state
  const [turnInfo, setTurnInfo] = useState(1);
  // 게임말 확정 버튼
  const [pieceConfirmButton, setPieceConfirmButton] = useState(false);
  const handleTileConfirm = (boo) => {
    setTileConfirmButton(boo);
  };
  const [warningPosition, setWarningPosition] = useState(false);

  const handleTilePush = () => {
    if (gameObjectRef.current) {
      gameObjectRef.current.tilePush();
    }
  };
  const handlePieceConfirm = () => {
    if (gameObjectRef.current) {
      gameObjectRef.current.pieceConfirm();
    }
  };
  const state = {
    turnInfo,
    setTurnInfo,
    handleTileConfirm,
    tileConfirmButton,
    pieceConfirmButton,
    setPieceConfirmButton,
    warningPosition,
    setWarningPosition,
  };

  return (
    <KeyboardControls map={[{ name: "clock", keys: ["r", "R"], up: true },{ name: "antiClock", keys: ["q", "Q"], up: true },]} >
      <UserInterface state={state} handleTilePush={handleTilePush} handlePieceConfirm={handlePieceConfirm} />
      <Canvas           camera={{ position: [-15, 10, 0], fov: 60, target: [0, 0, 10] }}>
        <Camera ref={cameraRef} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Suspense>
          <GameObejcts ref={gameObjectRef} cameraRef={cameraRef} state={state}/>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
export default Canva;
