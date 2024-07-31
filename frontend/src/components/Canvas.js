import { Canvas} from "@react-three/fiber";
import { Grid, GizmoHelper } from "@react-three/drei";
import GameObejcts from "./GameObject";
import Camera from "./Camera";
import React, { forwardRef, Suspense, useRef } from 'react';

function Canva(){
  const grid_size = [100, 100];
  const grid_position = [0, 0, 0];
  const cameraRef = useRef();
  return (
    <>
      <Canvas camera={{ position: [-15, 10, 0], fov: 60  ,target:[0,0,10]}}>
        {/* 총괄적으로 리턴을 모으는 위치입니다 */}
        <Camera  ref={cameraRef}/>
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <GizmoHelper></GizmoHelper>
        <Grid args={grid_size} position={grid_position} />
        {/* 타일들을 로드할때 시간이 좀 걸리기 때문 */}
        <Suspense>
          <GameObejcts cameraRef={cameraRef}   />
        </Suspense>
      </Canvas>
    </>
  );
};
export default Canva;