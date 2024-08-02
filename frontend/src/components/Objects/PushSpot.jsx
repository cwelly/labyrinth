import React, { useState, useRef, useEffect } from "react";
import { RigidBody,useEventListener,CuboidCollider ,useRapier  } from "@react-three/rapier";
function PushSpot( {...props}) {
  const [color, setColor] = useState("blue");
  const sphereRef = useRef();
  const { world } = useRapier();
  // const handleCollisionEnter = (event) => {
  //   if (event.other === sphereRef.current) {
  //     setColor('red');
  //     console.log("닿았습니다!")
  //   }
  // };
  
  if(sphereRef.current!==undefined){
    console.log(sphereRef.current )
    world.contactPairsWith(sphereRef.current.handle,(col2)=>{console.log(col2)})
  }
  
  const handleCollisionEnter= ({manifold ,target ,other}) =>{
    console.log("들어왔구나!")
    console.log(manifold)
    console.log(target)
    console.log(other)
  };
  return (
    <RigidBody  type="kinematicPosition"  onIntersectionEnter={(e)=>{console.log("come in!")}}>
      <CuboidCollider ref={sphereRef} position={[0, 0, 1]}
        args={[5, 3, 1]} sensor onIntersectionEnter={()=>{console.log("come in!!!");
          setColor("red")
        }} onCollisionEnter={()=>{console.log("드러왔구나");setColor("red");}} ></CuboidCollider>
      <mesh position={props.position}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} transparent wireframe opacity={0.5} />
      </mesh>
    </RigidBody>
  );
}

export default PushSpot;
