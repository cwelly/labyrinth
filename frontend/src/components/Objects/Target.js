import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useGLTF, Text, Text3D, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
function Target(props) {
  const targetRef = useRef();

  useFrame((state, delta) => {
    if (targetRef.current) {
      targetRef.current.rotation.y += 0.01;
    }
  });
  return (
    <>
      <Center top ref={targetRef}>
        <Text3D
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
    </>
  );
}
export default Target;
