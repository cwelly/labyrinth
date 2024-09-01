import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export function ViewCamera({ cameraPosition, viewport }) {
  const { gl, scene } = useThree();
  const cameraRef = useRef();

  useFrame(() => {
    gl.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
    gl.setScissor(viewport.x, viewport.y, viewport.width, viewport.height);
    gl.setScissorTest(true);
    gl.render(scene, cameraRef.current);
  });
  useEffect(() => {
    
  }, []);
  return (
    <>
      <perspectiveCamera ref={cameraRef} position={cameraPosition} fov={75} />
      <OrbitControls camera={cameraRef.current} />
    </>
  );
}

export default function ThreeViewCamera({}) {
  const { width, height } = useThree((state) => state.size);
  const thirdWidth = width / 3;

  return (
    <>
      <ViewCamera
        cameraPosition={[2, 2, 2]}
        viewport={{ x: 0, y: 0, width: thirdWidth, height }}
      ></ViewCamera>
      <ViewCamera
        cameraPosition={[0, 2, 2]}
        viewport={{ x: thirdWidth, y: 0, width: thirdWidth, height }}
      ></ViewCamera>
      <ViewCamera
        cameraPosition={[-2, 2, 2]}
        viewport={{ x: 2 * thirdWidth, y: 0, width: thirdWidth, height }}
      ></ViewCamera>
    </>
  );
}
