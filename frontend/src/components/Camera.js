import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect, 
} from "react";
import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import ThreeViewCamera from "./ViewCamera";
// function Camera() {
const Camera = forwardRef((props, ref) => {
  const cameraControlsRef = useRef();
  const mainRef=useRef();
  const settingRef = useRef();
  const { turnInfo,dragTilePosition } = props.state;
  const {set} = useThree(); 
  // 카메라의 위치를 초기 위치 로 리셋하는 함수
 
  useFrame(() => {
    if (turnInfo === 2) { 
      const nowPosi = mainRef.current.position;
      let endPosi = [dragTilePosition.x,dragTilePosition.y,dragTilePosition.z];
      let startPosi = [0,20,0] 
      if(dragTilePosition.x>-4.2&& dragTilePosition.x<4.2){
        if(dragTilePosition.x===4.1){
          startPosi=[-15,15,0]
          endPosi = endPosi.map((posi , idx) => {
            if(idx===2){
              if(dragTilePosition.z>0){
                return posi-6.15;
              }
              else{
                return posi+6.15;
              }
            }
            return posi;
          }) 
        }else if(dragTilePosition.x===-4.1){
          startPosi=[15,15,0]
          endPosi = endPosi.map((posi , idx) => {
            if(idx===2){
              if(dragTilePosition.z>0){
                return posi-6.15;
              }
              else{
                return posi+6.15;
              }
            }
            return posi;
          }) 
        }
        else{ 
          startPosi=[0,15,0]
          endPosi = endPosi.map((posi , idx) => {
            if(idx===2){
              if(dragTilePosition.z>0){
                return posi-6.15;
              }
              else{
                return posi+6.15;
              }
            }
            return posi;
          }) 
        }
      }
      else{
        if(dragTilePosition.z===4.1){ 
          startPosi=[0,15,-15]
          endPosi = endPosi.map((posi , idx) => {
            if(idx===0){
              if(dragTilePosition.x>0){
                return posi-6.15;
              }
              else{
                return posi+6.15;
              }
            }
            return posi;
          }) 
        }else if(dragTilePosition.z===-4.1){
          startPosi=[0,15,15]
          endPosi = endPosi.map((posi , idx) => {
            if(idx===0){
              if(dragTilePosition.x>0){
                return posi-6.15;
              }
              else{
                return posi+6.15;
              }
            }
            return posi;
          }) 
        }
        else{
          
          startPosi=[0,15,0]
          endPosi = endPosi.map((posi , idx) => {
            if(idx===0){
              if(dragTilePosition.x>0){
                return posi-6.15;
              }
              else{
                return posi+6.15;
              }
            }
            return posi;
          }) 
        }
      }
      set({camera : settingRef.current})
      cameraControlsRef.current.setLookAt(startPosi[0],startPosi[1], startPosi[2], endPosi[0], endPosi[1], endPosi[2], true);
    } else {
      set({camera : mainRef.current})
    }
  })
  // , [turnInfo,set , settingRef,mainRef,dragTilePosition]);
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
        position={[-15, 10, 0]}
        fov={60}
        target={[0, 0, 10]}
      />
      {(turnInfo===2&&<ThreeViewCamera/>)}
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
