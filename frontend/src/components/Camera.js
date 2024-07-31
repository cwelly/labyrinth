import React, { useRef,forwardRef ,useImperativeHandle } from "react";
import { CameraControls } from "@react-three/drei";

// function Camera() {
const Camera = forwardRef((props, ref) => {
  const cameraControlsRef = useRef();
  // 카메라의 위치를 초기 위치로 리셋하는 함수
  const resetCameraPosition = () => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(-10, 5, 0, 0, 0, 0, true);
    }
  };

  useImperativeHandle(ref, () => ({
    getCamera: () => cameraControlsRef.current,
  }));
  return (
    <>
      <CameraControls ref={cameraControlsRef}  />
    </>
  );
});

export default Camera;