import { CameraControls, OrbitControls } from "@react-three/drei";
import { LTile } from "./Objects/LTile";
import * as THREE from "three";
import { Vector3 } from "three";
import { useEffect, useRef } from "react";
import { PieceTest } from "./Objects/PieceTest";
import { OTile } from "./Objects/OTile";
import { ITile } from "./Objects/ITile";
function GameRoomCanvas() {
    // const cameraRef = useRef();
    // useEffect(()=>{
    //     cameraRef.current.setBoundary(
    //         new THREE.Box3(
    //           new THREE.Vector3(0, 0, 0),
    //           new THREE.Vector3(0, 0, 0)
    //         )
    //       );
    // },[])
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
 
      <PieceTest
      color="red"
        position={[1, -11, -20]}
        rotation={[2, 0, -0]}
        scale={[0.2, 0.2, 0.2]}
      />
      <LTile
        position={[20, 0, -17]}
        rotation={[1, 1, -2]}
        scale={[1, 0.1, 1]}
      />
      <OTile position={[20, 2, 4]} rotation={[1, 0, -1]} scale={[1, 0.1, 1]} />
      <ITile
        position={[-21, -15, -13]}
        rotation={[2, 0, 1]}
        scale={[1, 0.1, 1]}
      />
      <LTile
        position={[18, 15, -25]}
        rotation={[1, 1, 0]}
        scale={[1, 0.1, 1]}
      />
      <OTile position={[-25, -4, 5]} rotation={[1, 0, 0]} scale={[1, 0.1, 1]} />
      <PieceTest
      color="orange"
        position={[1, -4, -28]}
        rotation={[1, 0, -1]}
        scale={[0.2, 0.2, 0.2]}
      />
      <ITile
        position={[7, -15, 28]}
        rotation={[1, 0, -1]}
        scale={[1, 0.1, 1]}
      />
      <PieceTest
      color="navy"
        position={[-20, 10, 10]}
        rotation={[3, -1, 3]}
        scale={[0.2, 0.2, 0.2]}
      />
      {/* ///////////////////////////////////////////////////////////////////////////////// */}
      <LTile
        position={[-20,1, -11]}
        rotation={[2, 0, -0]}
        scale={[1, 0.1, 1]}
      />
      <OTile
        position={[ -17,20, 0]}
        rotation={[1, 1, -2]}
        scale={[1, 0.1, 1]}
      />
      <ITile position={[4,20, 2]} rotation={[1, 0, -1]} scale={[1, 0.1, 1]} />
      <PieceTest
      color="blue"
        position={[-13,-21, -15]}
        rotation={[2, 0, 1]}
        scale={[0.2, 0.2, 0.2]}
      />
      <LTile
        position={[ -25,18, 15]}
        rotation={[1, 1, 0]}
        scale={[1, 0.1, 1]}
      />
      <OTile position={[ 5,-25, -4]} rotation={[1, 0, 0]} scale={[1, 0.1, 1]} />
      <ITile
        position={[-28,1, -4]}
        rotation={[1, 0, -1]}
        scale={[1, 0.1, 1]}
      />
      <PieceTest
      color="yellow"
        position={[28,7, -15 ]}
        rotation={[1, 0, -1]}
        scale={[0.2, 0.2, 0.2]}
      />
      <LTile
        position={[10,-20,  10]}
        rotation={[3, -1, 3]}
        scale={[1, 0.1, 1]}
      />
{/* ///////////////////////////////////////////////////////////////////////////////// */}
<PieceTest
      color="green"
        position={[-11,-20,1 ]}
        rotation={[2, 0, -0]}
        scale={[0.2, 0.2, 0.2]}
      />
      <OTile
        position={[ 0,-17,20]}
        rotation={[1, 1, -2]}
        scale={[1, 0.1, 1]}
      />
      <ITile position={[2,4,20]} rotation={[1, 0, -1]} scale={[1, 0.1, 1]} />
      <LTile
        position={[-15,-13,-21]}
        rotation={[2, 0, 1]}
        scale={[1, 0.1, 1]}
      />
      <PieceTest
      color="purple"
        position={[  15,-25,18]}
        rotation={[1, 1, 0]}
        scale={[0.2, 0.2, 0.2]}
      />
      <OTile position={[ -4,5,-25]} rotation={[1, 0, 0]} scale={[1, 0.1, 1]} />
      <ITile
        position={[-4,-28,1]}
        rotation={[1, 0, -1]}
        scale={[1, 0.1, 1]}
      />
      <LTile
        position={[-15,28,7 ]}
        rotation={[1, 0, -1]}
        scale={[1, 0.1, 1]}
      />
      <OTile
        position={[10,10,-20]}
        rotation={[3, -1, 3]}
        scale={[1, 0.1, 1]}
      /> 
      <OrbitControls autoRotate={true} minDistance={1} maxDistance={40}/>
      {/* <CameraControls   ref={cameraRef} minDistance={1} maxDistance={40}></CameraControls> */}
    </>
  );
}
export default GameRoomCanvas;
