import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useGLTF, Text, Text3D, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
function Target(props) {
  const { targetAnimation } = props;
  const [movementAmount, setMovementAmount] = useState(0);
  const maxHeight = 20;
  const textRef = useRef();
  const targetRef = useRef();
  // Target mesh에 대한 raycast를 비활성화
  React.useEffect(() => {
    if (textRef.current) {
      textRef.current.raycast = () => null;
    }
  }, []);
  useFrame((state, delta) => {
    if (targetRef.current) {
      targetRef.current.rotation.y += 0.01;
      // console.log(movementAmount, "어디길래 안나와?",targetAnimation)
      // console.log(targetRef.current.position,"현재 포지션")
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
      if (targetAnimation === "down" && movementAmount > 0) {
        // console.log("지금 다운이 들어 온거 맞아? ", movementAmount , targetRef.current.position )
        if (movementAmount - delta * 100 < 0) {
          targetRef.current.position.y = 0;
          setMovementAmount(0);
        } else {
          targetRef.current.position.y = movementAmount - delta * 100;
          setMovementAmount(movementAmount - delta * 100);
        }
      }
    }
  });
  return (
    <group ref={targetRef} position={[0, 3, 0]}>
      {/* <axesHelper scale={2} position={[0, 3, 0]}></axesHelper> */}
      <Center top>
        <Text3D
          ref={textRef}
          position={[0, 6, 0]}
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
        </Text3D>
      </Center>
    </group>
  );
}
export default Target;
