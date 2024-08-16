/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 oTile.glb --transform 
Files: oTile.glb [7.45KB] > C:\Users\Hyunho\Documents\업무\수습\labyrinth\frontend\src\assets\oTile-transformed.glb [1.96KB] (74%)
*/

import React, { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { useGLTF, Edges, Text3D, Center } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import Target from "./Target";
export const OTile = forwardRef((props, ref) => {
  // export function OTile({isDraged=false,...props}) {
  const { isDraged = false } = props;
  const { nodes, materials } = useGLTF("/oTile-transformed.glb");
  const [targetAnimation,setTargetAnimation] =useState("");
  if(props.targetAnimation!==undefined){
    setTargetAnimation(props.targetAnimation);
  }
  return (
    <group {...props} position={props.position} ref={ref} dispose={null}>
      {props.userData?.target !== undefined &&<Target target={props.userData.target} scale={props.scale} targetAnimation={ targetAnimation}   ></Target>}
      <mesh
        geometry={nodes.flor_tile.geometry}
        material={materials.PaletteMaterial001}
      >
      </mesh>
    </group>
  );
});

useGLTF.preload("/oTile-transformed.glb");
