/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 LTile.glb --transform 
Files: LTile.glb [7.43KB] > C:\Users\Hyunho\Documents\업무\수습\labyrinth\frontend\src\assets\LTile-transformed.glb [3.46KB] (53%)
*/

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useGLTF } from "@react-three/drei";

export const LTile = forwardRef((props, ref) => {
  const { isDraged = false } = props;
  const { nodes, materials } = useGLTF("/LTile-transformed.glb");
//   const lTileRef = useRef();
// useImperativeHandle(ref, () => ({
//   getITile: () => lTileRef.current,
// }));
  return (
    <group {...props} position={props.position} ref={ref} dispose={null}>
      <group>
        <mesh geometry={nodes.Cube.geometry} material={materials.floor} />
        <mesh geometry={nodes.Cube_1.geometry} material={materials.outside} />
        <mesh
          geometry={nodes.Cube_2.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          geometry={nodes.Cube_3.geometry}
          material={materials.wall_color}
        />
      </group>
    </group>
  );
});

useGLTF.preload("/LTile-transformed.glb");
