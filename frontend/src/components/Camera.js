import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";

export default function Camera() {
  const cameraControlsRef = useRef();
  // 카메라의 위치를 초기 위치로 리셋하는 함수
  const resetCameraPosition = () => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(0, 5, 10, 0, 0, 0, true);
    }
  };

  return (
    <>
      <CameraControls ref={cameraControlsRef} maxPolarAngle = {Math.PI/2} />
    </>
  );
}
