import { ITile } from "./ITile";
import { LTile } from "./LTile";
import { OTile } from "./OTile";
import coordinates from "../constant/BoardCoordinates.js";
import React, { useRef, Suspense } from "react";
import { InstancedMesh } from "@react-three/drei";

export default function GameObejcts() {
  const scale = [1, 0.1, 1];
  //모든 타일의 크기가 2/2/2 로 같다고 가정하고 작성
  console.log(coordinates);
  const tile_list = coordinates.map((coordinate) => {
    if (coordinate.key % 3 === 0) {
      return (
        <LTile
          key={coordinate.key}
          position={[coordinate.x, coordinate.z, coordinate.y]}
          scale={scale}
        />
      );
    } else if (coordinate.key % 3 === 1) {
      return (
        <ITile
          key={coordinate.key}
          position={[coordinate.x, coordinate.z, coordinate.y]}
          scale={scale}
        />
      );
    } else {
      return (
        <OTile
          key={coordinate.key}
          position={[coordinate.x, coordinate.z, coordinate.y]}
          scale={scale}
        />
      );
    }
  });
  
  return <Suspense fallback={null}>{tile_list}</Suspense>;
}
