import { Canvas } from "@react-three/fiber";
import {  Grid ,GizmoHelper} from '@react-three/drei';
import Camera from './Camera'
export default function Canva() {
    const grid_size=[10,10]
    const grid_position=[0,0,0]
  return (
    <>
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        {/* <OrbitControls autoRotate={false} minDistance={5} maxDistance={50}/> */}
        <Camera/>
        {/* <mesh>
          <ambientLight intensity={1} />
          <directionalLight position={[-1, 0, 1]} intensity={0.5} />
          <boxGeometry args={size} />
          <meshStandardMaterial attach="material" color={0xff0000} />
        </mesh> */}
        <GizmoHelper></GizmoHelper>
        <Grid args={grid_size} position={grid_position} />
      </Canvas>
    </>
  );
}
