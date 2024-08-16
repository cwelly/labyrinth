import React, { useRef,useState, forwardRef, useImperativeHandle } from "react";
import { useGLTF, Text, Text3D, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
function Target(props) {
  const {targetAnimation}=props
  const [movementAmount,setMovementAmount] = useState(0);
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
      // console.log(targetRef.current.position,"현재 포지션")
      // state의 상태에 따라 애니메이션 실행
      if(targetAnimation==="up"&& movementAmount<5){
        if(movementAmount+delta>5){
          targetRef.current.position.y =movementAmount;
          setMovementAmount(5)
        }
        else{
          targetRef.current.position.y =0-(movementAmount+delta);
          setMovementAmount(movementAmount+delta);
        }
      }
      else if(targetAnimation === "down"){
        
      }
    }
  });
  return (
    <Center top ref={targetRef} >
      <Text3D ref={textRef}
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
  );
}
export default Target;
