import { Canvas, useLoader } from "@react-three/fiber";
import { Grid, GizmoHelper } from "@react-three/drei";
import GameObejcts from "./GameObject";
import Camera from "./Camera";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { Suspense } from 'react';

export default function Canva() {
  const grid_size = [100, 100];
  const grid_position = [0, 0, 0];
  return (
    <>
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        {/* 총괄적으로 리턴을 모으는 위치입니다 */}
        <Camera />
        <ambientLight intensity={0.9} />
        
        <GizmoHelper></GizmoHelper>
        <Grid args={grid_size} position={grid_position} />
        {/* 타일들을 로드할때 시간이 좀 걸리기 때문 */}
        <Suspense>
          <GameObejcts />
        </Suspense>
      </Canvas>
    </>
  );
}
