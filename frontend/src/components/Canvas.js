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
let testGamePieceInfo = [
  { key: 1, nickName: "Mike", color: "red", coordinate: 1  , targets:  ["C", "G", "H", "J", "K", "L",]},
  { key: 2, nickName: "Sam", color: "blue", coordinate: 13 , targets: ["A", "B", "E", "F", "D", "I",] },
  { key: 3, nickName: "Susie", color: "green", coordinate: 27, targets: ["M", "N", "O", "P", "Q", "R",] },
  { key: 4, nickName: "Kai", color: "yellow", coordinate: 41 , targets: ["S", "T", "U", "X", "Y", "Z",]},
];
function Canva() {
  const grid_size = [100, 100];
  const grid_position = [0, 0, 0];
  const cameraRef = useRef();
  const gameObjectRef = useRef();
  
  // 자신의 번호를 넘겨주는 state
  const [myPieceInfo ,setMyPieceInfo] = useState({ nickName: "Sam" , key:2 });
  // 누구의 차례인지 받아오는 state
  const [whosTurn , setWhosTurn] = useState(2);
  // 게임말의 정보를 서버에서 받아오는 정보
  const [userInfo, setUserInfo] = new useState(testGamePieceInfo);
  // 누구 차례인지 정하는 state
  const [] = useState();
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
    userInfo, setUserInfo,
    whosTurn , setWhosTurn,
    myPieceInfo ,setMyPieceInfo,
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
