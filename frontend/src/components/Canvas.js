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
  // 타일확정 버튼 state
  const [tileConfirmButton, setTileConfirmButton] = useState(false);
  // 게임의 현재 상태(턴과는 상관없는 )state
  const [turnInfo,setTurnInfo] = useState(1);
  const handleTileConfirm = (boo) => {
    setTileConfirmButton(boo);
  };

  const state = {
    turnInfo ,setTurnInfo,handleTileConfirm
  }

  return (
    <>
      <KeyboardControls
        map={[
          { name: "clock", keys: ["r", "R"] ,up:true},
          { name: "antiClock", keys: ["q", "Q"]  , up:true},
        ]}
        
      >
        <UserInterface isTileConfirmButton={tileConfirmButton} handleTileConfirmButton={handleTileConfirm} />
        <Canvas
          camera={{ position: [-15, 10, 0], fov: 60, target: [0, 0, 10] }}
        >
          {/* 총괄적으로 리턴을 모으는 위치입니다 */}
          <Camera ref={cameraRef} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          {/* <GizmoHelper></GizmoHelper> */}
          {/* <Grid args={grid_size} position={grid_position} /> */}
          {/* 타일들을 로드할때 시간이 좀 걸리기 때문 */}
          <Suspense>
            <GameObejcts
              cameraRef={cameraRef}
              state = {state}
            />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}
export default Canva;
