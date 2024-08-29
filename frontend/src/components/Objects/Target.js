import React, { useRef, useState } from "react";
import { Text3D, Center, Outlines, Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
function Target(props) {
  const { targetAnimation } = props;
  const [movementAmount, setMovementAmount] = useState(0);
  const maxHeight = 18;
  const minHeight = 10;
  const textRef = useRef();
  const targetRef = useRef();
  const centerRef= useRef();
  // Target mesh에 대한 raycast를 비활성화
  React.useEffect(() => {
    if (textRef.current) {
      textRef.current.raycast = () => null;
    }
  }, []);
  useFrame((state, delta) => {
    if (targetRef.current) {
      textRef.current.rotation.y += 0.01;  
      // state의 상태에 따라 애니메이션 실행
      if (targetAnimation === "up" && movementAmount < maxHeight) {
        if (movementAmount + delta * 100 > maxHeight) {
          targetRef.current.position.y = maxHeight;
          setMovementAmount(maxHeight);
        } else {
          targetRef.current.position.y = movementAmount + delta * 100;
          setMovementAmount(movementAmount + delta * 100);
        }
      }
      if (targetAnimation === "down" && movementAmount > minHeight) {
        // console.log("지금 다운이 들어 온거 맞아? ", movementAmount , targetRef.current.position )
        if (movementAmount - delta * 100 < minHeight) {
          targetRef.current.position.y = minHeight;
          setMovementAmount(minHeight);
        } else {
          targetRef.current.position.y = movementAmount - delta * 100;
          setMovementAmount(movementAmount - delta * 100);
        }
      }
    }
  });
  return (
    <group ref={targetRef} position={[0, 10, 0]}>
      <Center ref={centerRef}   > 
        <Text3D
          ref={textRef}
          position={[0, 0, 0]}
          size={0.5}
          font={"/Noto Sans KR Black_Regular.json"}
          scale={
            new Vector3(
              1 / props.scale[0],
              1 / props.scale[1],
              1 / props.scale[2]
            )
          }
        >
          {props.target}
          <Edges
            lineWidth={1}
            scale={1.0}
            renderOrder={1000}
            color={"black"}
          ></Edges>
        </Text3D>
      </Center>
    </group>
  );
}
export default Target;
