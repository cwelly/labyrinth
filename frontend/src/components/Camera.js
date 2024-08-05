import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import { min } from "three/webgpu";
// function Camera() {
const Camera = forwardRef((props, ref) => {
  const cameraControlsRef = useRef();
  // 카메라의 위치를 초기 위치로 리셋하는 함수
  const resetCameraPosition = () => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(-10, 5, 0, 0, 0, 0, true);
    }
  };

  // 초기에 카메라가 바라볼수 있는 위치를 제어하는 메소드
  useEffect(() => {
    if(cameraControlsRef!==undefined){
      cameraControlsRef.current.setBoundary(new THREE.Box3(new THREE.Vector3(-8.0,0,-8.0),new THREE.Vector3(8.0,2,8.0)))
    }
  }, []);
  //setBoundary={new THREE.Box3(new THREE.Vector3(-8.0,0,-8.0),new THREE.Vector3(8.0,2,8.0))}
  useImperativeHandle(ref, () => ({
    getCamera: () => cameraControlsRef.current,
  }));
  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={30}
      />
    </>
  );
});

export default Camera;
