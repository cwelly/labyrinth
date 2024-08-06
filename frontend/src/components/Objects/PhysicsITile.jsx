/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 ./public/ITile.glb --transform 
Files: ./public/ITile.glb [5.96KB] > C:\Users\Hyunho\Documents\업무\수습\labyrinth\frontend\ITile-transformed.glb [2.67KB] (55%)
*/

import React, { useRef, forwardRef, useImperativeHandle,useEffect} from "react";
import { useGLTF, Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";



// 타일을 만든다면 , 드래그 되었을때 윤곽선이 나오는 설정을 꼭 해줘야 함
// export function PhysicsITile(props) {
  export const PhysicsITile = forwardRef((props, ref) => {
  const { isDraged = false } = props;
  
  // console.log(props.position)
  // export function PhysicsITile({ isDraged = false, ...props }) {
  const { nodes, materials } = useGLTF("/ITile-transformed.glb");
  const dragTileRef = useRef();

  useEffect(() => {
    if (dragTileRef.current) {
      dragTileRef.current.customData = {
        type: 'I',
      };
    }
  }, []);
  useImperativeHandle(ref, () => ({
    getDragTile: () => dragTileRef.current,
  }));
  useFrame(()=>{
    if(dragTileRef){
      console.log(dragTileRef.current.position)
    }
  })

  return (
    <group ref={dragTileRef} visible={props.isVisible===true} {...props}  dispose={null}>
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
        {/* <RigidBody ref={rigidRef} colliders="cuboid" type="kinematicPosition">
          <CuboidCollider
            args={[1, 1, 1]}
            onIntersectionEnter={() => {
              console.log("come in!");
            }}
            onCollisionEnter={() => {
              console.log("come in!");
            }}
          ></CuboidCollider>
        </RigidBody> */}
      </group>
    </group>
  );
// }
});

useGLTF.preload("/ITile-transformed.glb");
