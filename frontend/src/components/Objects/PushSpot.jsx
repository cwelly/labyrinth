import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
// import {
//   RigidBody,
//   useEventListener,
//   CuboidCollider,
//   useRapier,
// } from "@react-three/rapier";
const PushSpot = forwardRef((props, ref) => {
  // function PushSpot({ ...props }) {
  const [color, setColor] = useState("blue");
  const pushSpotRef = useRef();
  useImperativeHandle(ref, () => ({
    getPushSpot: () => pushSpotRef.current,
  }));
  return (
    <mesh ref={pushSpotRef} position={props.position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} transparent wireframe opacity={0.5} />
    </mesh>
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
  );
})

export default PushSpot;
