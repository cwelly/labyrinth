import React, { useState, useRef, useEffect } from "react";
import { RigidBody,useEventListener   } from "@react-three/rapier";

function PushSpot( {...props}) {
  const [color, setColor] = useState("blue");
  const sphereRef = useRef();

  const handleCollisionEnter = (event) => {
    if (event.other === sphereRef.current) {
      setColor('red');
      console.log("닿았습니다!")
    }
  };
  return (
    <RigidBody type="fixed" ref={sphereRef} colliders="ball" onCollisionEnter={handleCollisionEnter}>
      <mesh position={props.position}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} transparent wireframe opacity={0.5} />
      </mesh>
    </RigidBody>
  );
}

export default PushSpot;
