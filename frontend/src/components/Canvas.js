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
import React, { forwardRef, Suspense, useEffect, useRef, useState } from "react";
import UserInterface from "./UserInteface";
import axios from "axios";
import * as THREE from "three";
// 서버에서 받아온 각 좌표에 대한 타일 및 방향 정보
let server_side_tile_infos = [
  { type: "L", dir: 0 },
  { type: "L", dir: 1 },
  { type: "O", dir: 0, target: "A" },
  { type: "I", dir: 0 },
  { type: "O", dir: 0, target: "B" },
  { type: "I", dir: 0 },
  { type: "L", dir: 1 },

  { type: "L", dir: 0 },
  { type: "O", dir: 2, target: "C" },
  { type: "L", dir: 1, target: "D" },
  { type: "I", dir: 1 },
  { type: "L", dir: 3 },
  { type: "O", dir: 2, target: "E" },
  { type: "O", dir: 2, target: "F" },

  { type: "O", dir: 3, target: "G" },
  { type: "L", dir: 0, target: "H" },
  { type: "O", dir: 3, target: "I" },
  { type: "I", dir: 0, target: "J" },
  { type: "O", dir: 0, target: "K" },
  { type: "I", dir: 0 },
  { type: "O", dir: 1, target: "L" },

  { type: "L", dir: 3 },
  { type: "L", dir: 1 },
  { type: "L", dir: 1, target: "M" },
  { type: "L", dir: 0 },
  { type: "O", dir: 0, target: "N" },
  { type: "L", dir: 1 },
  { type: "I", dir: 1 },

  { type: "O", dir: 3, target: "O" },
  { type: "I", dir: 0 },
  { type: "O", dir: 2, target: "P" },
  { type: "I", dir: 1 },
  { type: "O", dir: 1, target: "Q" },
  { type: "L", dir: 3 },
  { type: "O", dir: 1, target: "R" },

  { type: "L", dir: 3 },
  { type: "I", dir: 0 },
  { type: "L", dir: 1 },
  { type: "L", dir: 0, target: "S" },
  { type: "I", dir: 1 },
  { type: "L", dir: 0, target: "T" },
  { type: "L", dir: 0, target: "U" },

  { type: "L", dir: 3 },
  { type: "I", dir: 0 },
  { type: "O", dir: 2, target: "V" },
  { type: "I", dir: 0 },
  { type: "O", dir: 2, target: "W" },
  { type: "O", dir: 2, target: "X" },
  { type: "L", dir: 2 },
];
let testGamePieceInfo = [
  { key: 1, nickName: "Mike", color: "red", coordinate: 1  , targets:  ["C", "G", "H", "J", "K", "L",]},
  { key: 2, nickName: "Sam", color: "blue", coordinate: 13 , targets: ["A", "B", "E", "F", "D", "I",] },
  { key: 3, nickName: "Susie", color: "green", coordinate: 27, targets: ["M", "N", "O", "P", "Q", "R",] },
  { key: 4, nickName: "Kai", color: "yellow", coordinate: 41 , targets: ["S", "T", "U", "X", "Y", "Z",]},
];
function Canva({socket}) {
  const cameraRef = useRef();
  const gameObjectRef = useRef();
  
  //
  const [movingPieceInfo , setMovingPieceInfo] = useState({})
  // 다른 사람의 드래그 타일의 위치를 정하는 state
  const [dragTilePosition, setDragTilePosition] = useState(
    new THREE.Vector3(0, 2, 0)
  );
  // 드래그 타일의 타겟을 정하는 state
  const [dragTileTarget, setDragTileTarget] = useState();
  // 드래그 타일의 타입을 정하는 state
  const [dragTileType, setDragTileType] = useState("");
  // 드래그 타일의 회전값을 제어하기 위한 state
  const [dragTileDir, setDragTileDir] = useState(0);
  // 서버에서 온 타일들의 정보를 기록하는 state
  const [serverTileInfo, setServerTileInfo] = useState(server_side_tile_infos);
  // 자신의 번호를 넘겨주는 state
  // const [myPieceInfo ,setMyPieceInfo] = useState({ nickName: "Sam" , key:2 });
  const [myPieceInfo ,setMyPieceInfo] = useState({  });
  // 누구의 차례인지 받아오는 state
  const [whosTurn , setWhosTurn] = useState(2);
  // 게임말의 정보를 서버에서 받아오는 정보
  // const [userInfo, setUserInfo] = new useState(testGamePieceInfo);
  const [userInfo, setUserInfo] = new useState([]);
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
    turnInfo,socket,
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
    serverTileInfo, setServerTileInfo,
    dragTileTarget, setDragTileTarget,
    dragTileType, setDragTileType,
    dragTileDir, setDragTileDir,
    dragTilePosition, setDragTilePosition,
    movingPieceInfo,setMovingPieceInfo,
  };

  // 시작할때 받아오는 useEffect
  useEffect(()=>{
    axios.get("http://localhost:3001/game/init")
    .then((res)=>{
      console.log(res.data);
      setUserInfo(res.data.answer.userInfo);
      setServerTileInfo(res.data.answer.tileInfo);
      // 내 피스의 정보를 저장하려면?!
      const myPiece = res.data.answer.userInfo.filter(user=>(user.nickName===localStorage.getItem("nickname").replaceAll('"', '')))[0];
      setMyPieceInfo(myPiece)
      setWhosTurn(res.data.answer.whosTurn);
      setTurnInfo(res.data.answer.turnInfo);
      setDragTileDir(res.data.answer.dragTileInfo.dir);
      setDragTilePosition(new THREE.Vector3(res.data.answer.dragTileInfo.position[0],res.data.answer.dragTileInfo.position[1],res.data.answer.dragTileInfo.position[2]))
      setDragTileTarget(res.data.answer.dragTileInfo.target)
      setDragTileType(res.data.answer.dragTileInfo.type)
      setMovingPieceInfo(res.data.answer.movingPieceInfo);
    })
    .catch()
  },[])
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
