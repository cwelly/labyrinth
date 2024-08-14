import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useGLTF, Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ITile } from "./ITile";
export const DragedTile = forwardRef((props, ref) => {
  const dragTileRef = useRef();
  const { position, rotation, scale, isVisible, target } = props;
  useImperativeHandle(ref, () => ({
    getDragTile: () => dragTileRef.current,
    updatePosition: (confirmTileInfo) => {
      if (dragTileRef.current) {
        const newPosition = new THREE.Vector3(
          confirmTileInfo.position.x,
          confirmTileInfo.position.y,
          confirmTileInfo.position.z
        );

        // dragTileRef의 position을 업데이트합니다.
        dragTileRef.current.position.copy(newPosition);

        // dragTileRef의 행렬을 업데이트합니다.
        dragTileRef.current.updateMatrix();
        dragTileRef.current.updateMatrixWorld(true);
      }
    },
    // getPosition: () => position,
  }));
  //   console.log(props)
  return (
    <>
      <ITile
        visible={isVisible === true}
        ref={dragTileRef}
        position={position}
        rotation={rotation}
        scale={scale}
      ></ITile>
    </>
  );
});
