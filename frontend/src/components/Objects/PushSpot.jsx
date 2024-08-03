import React, { useState, useRef, useEffect } from "react";
import {
  RigidBody,
  useEventListener,
  CuboidCollider,
  useRapier,
} from "@react-three/rapier";
function PushSpot({ ...props }) {
  // const [color, setColor] = useState("blue");
  // const sphereRef = useRef();
  
  return (
    // <RigidBody  type="kinematicPosition"  onIntersectionEnter={(e)=>{console.log("come in!")}}>
    //   <CuboidCollider  ref={sphereRef} position={[0, 0, 1]}
    //     args={[5, 3, 1]} sensor onIntersectionEnter={()=>{console.log("come in!!!");
    //       setColor("red")
    //     }} onCollisionEnter={()=>{console.log("드러왔구나");setColor("red");}} ></CuboidCollider>
    //   <mesh position={props.position}>
    //     <sphereGeometry args={[1, 32, 32]} />
    //     <meshStandardMaterial color={color} transparent wireframe opacity={0.5} />
    //   </mesh>
    // </RigidBody>
    <>
    </>
  );
}

export default PushSpot;
