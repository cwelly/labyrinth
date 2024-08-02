/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 ./public/ITile.glb --transform 
Files: ./public/ITile.glb [5.96KB] > C:\Users\Hyunho\Documents\업무\수습\labyrinth\frontend\ITile-transformed.glb [2.67KB] (55%)
*/

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useGLTF, Edges } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

// 타일을 만든다면 , 드래그 되었을때 윤곽선이 나오는 설정을 꼭 해줘야 함

export const PhysicsITile = forwardRef((props, ref) => {
  const { isDraged = false } = props;
  // export function PhysicsITile({ isDraged = false, ...props }) {
  const { nodes, materials } = useGLTF("/ITile-transformed.glb");
  const rigidRef = useRef();

  useImperativeHandle(ref, () => ({
    getRigidBody: () => rigidRef.current,
  }));
  // if(rigidRef.current!==undefined){
  //   console.log(props.position)
  //   rigidRef.current.setTranslation({x:props.position[0],y:props.position[2],z:props.position[1]},true)
  //   console.log(rigidRef.current.translation())
  // }
  return (
    <group {...props} dispose={null}>
      <group>
        <mesh geometry={nodes.Cube.geometry} material={materials.floor}>
          <Edges
            visible={isDraged}
            lineWidth={5}
            scale={1.1}
            renderOrder={1000}
            color={"black"}
          ></Edges>
        </mesh>
        <mesh geometry={nodes.Cube_1.geometry} material={materials.outside}>
          <Edges
            visible={isDraged}
            lineWidth={5}
            scale={1.1}
            renderOrder={1000}
            color={"black"}
          ></Edges>
        </mesh>
        <mesh geometry={nodes.Cube_2.geometry} material={materials.wall_color}>
          <Edges
            visible={isDraged}
            lineWidth={5}
            scale={1.1}
            renderOrder={1000}
            color={"black"}
          ></Edges>
        </mesh>
        <RigidBody ref={rigidRef} colliders="cuboid" type="kinematicPosition">
          <CuboidCollider args={[1, 1, 1]} onIntersectionEnter={()=>{console.log("come in!")}}  onCollisionEnter={()=>{console.log("come in!")}}></CuboidCollider>
        </RigidBody>
      </group>
    </group>
  );
  // }
});

useGLTF.preload("/ITile-transformed.glb");
