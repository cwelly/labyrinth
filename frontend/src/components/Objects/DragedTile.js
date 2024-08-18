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
import { OTile } from "./OTile";
import { LTile } from "./LTile";
export const DragedTile = forwardRef((props, ref) => {
  const dragTileRef = useRef();
  const { position, rotation, scale, isVisible, target, type } = props;
  useImperativeHandle(ref, () => ({
    getDragTile: () => dragTileRef.current.getTile(),
    updatePosition: (confirmTileInfo) => {
      if (dragTileRef.current) {
        const newPosition = new THREE.Vector3(
          confirmTileInfo.position.x,
          confirmTileInfo.position.y,
          confirmTileInfo.position.z
        );

        // dragTileRef의 position을 업데이트합니다.
        dragTileRef.current.position=(newPosition);

        // dragTileRef의 행렬을 업데이트합니다.
        // dragTileRef.current.updateMatrix();
        // dragTileRef.current.updateMatrixWorld(true);
      }
    },
    // getPosition: () => position,
  }));
  //   console.log(props)
  if (type === "L") {
    return (
      <LTile
        visible={isVisible === true}
        ref={dragTileRef}
        position={position}
        rotation={rotation}
        scale={scale}
        userData={{
          target: target,
        }}
      ></LTile>
    );
  }
  else if (type === "O") {
    return (
      <OTile
        visible={isVisible === true}
        ref={dragTileRef}
        position={position}
        rotation={rotation}
        scale={scale}
        userData={{
          target: target,
        }}
      ></OTile>
    );
  }
  else {
    return (

      <ITile
        visible={isVisible === true}
        ref={dragTileRef}
        position={position}
        rotation={rotation}
        scale={scale}
        userData={{
          target: target,
        }}
      ></ITile>

    );
  }
});
