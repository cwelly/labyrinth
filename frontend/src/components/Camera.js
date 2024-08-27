import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
// function Camera() {
const Camera = forwardRef((props, ref) => {
  const cameraControlsRef = useRef();
  const mainRef=useRef();
  const settingRef = useRef();
  const { turnInfo,dragTilePosition } = props.state;
  const {set} = useThree();
  const [stopCamera, setStopCamera] = useState(false);
  // 카메라의 위치를 초기 위치 로 리셋하는 함수
  const resetCameraPosition = () => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(0,10, 0, dragTilePosition.x, dragTilePosition.y, dragTilePosition.z, true);
    }
  };

  useEffect(() => {
    if (turnInfo === 2) {
      const nowPosi = mainRef.current.position;
      let startPosi = [0,20,0]
      if(nowPosi.x>0){
        if(nowPosi.z>0){
          startPosi=[15,20,15]
        }
        else{
          startPosi=[15,20,-15]
        }
      }
      else{
        if(nowPosi.z>0){
          startPosi=[-15,20,15]
        }
        else{
          startPosi=[-15,20,-15]
        }
      }
      set({camera : settingRef.current})
      cameraControlsRef.current.setLookAt(startPosi[0],20, startPosi[2], dragTilePosition.x, dragTilePosition.y, dragTilePosition.z, true);
    } else {
      set({camera : mainRef.current})
    }
  }, [turnInfo,set , settingRef,mainRef,dragTilePosition]);
  // 초기에 카메라가 바라볼수 있는 위치를 제어하는 메소드
  useEffect(() => {
    if (cameraControlsRef !== undefined) {
      cameraControlsRef.current.setBoundary(
        new THREE.Box3(
          new THREE.Vector3(-8.0, 0, -8.0),
          new THREE.Vector3(8.0, 2, 8.0)
        )
      );
    }
  }, []);
  // setBoundary={new THREE.Box3(new THREE.Vector3(-8.0,0,-8.0),new THREE.Vector3(8.0,2,8.0))}
  useImperativeHandle(ref, () => ({
    getCamera: () => cameraControlsRef.current,
  }));
  return (
    <>
      <PerspectiveCamera ref={settingRef} position={[0, 10, 0]} target={dragTilePosition} fov={75} />

      <PerspectiveCamera
        ref={mainRef}
        makeDefault
        position={[-15, 10, 0]}
        fov={60}
        target={[0, 0, 10]}
      />

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
