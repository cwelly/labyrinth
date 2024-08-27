import {
  GradientTexture,
  Image,
  PointMaterial,
  Points,
  Sparkles,
} from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
let count = 5;
const PushSpot = forwardRef((props, ref) => {
  const pushSpotRef = useRef();
  const portalRef = useRef();
  useImperativeHandle(ref, () => ({
    getPushSpot: () => pushSpotRef.current,
  }));
  useFrame((state, delta) => {
    portalRef.current.rotation.z += delta;
  });
  const texture = useLoader(TextureLoader, "/portalImage2.png");
  return (
    <>
      <Sparkles
        position={[props.position[0], props.position[2]+0.3, props.position[1]]}
        count={50}
        scale={[2.05, 0.5, 2.05]}
        size={10}
        speed={2}
        noise={new THREE.Vector3(3, 3, 3)}
        color={"#80ccd4"}
      />
      <mesh
        ref={portalRef}
        rotation={[(Math.PI * 3) / 2, 0, 0]}
        position={[props.position[0], props.position[2], props.position[1]]}
      >
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial
        opacity={0.5}
          map={texture}
          transparent
          alphaTest={0.1} // Adjust if needed to handle transparency properly
        />
      </mesh>

      <mesh
        visible={false}
        ref={pushSpotRef}
        position={[props.position[0], props.position[2] + 5, props.position[1]]}
      >
        <boxGeometry args={[2, 10, 2]} />
        <meshStandardMaterial
          color="blue"
          transparent
          flatShading
          opacity={0.5}
        >
          {/* <GradientTexture
            stops={[0, 1]} // As many stops as you want
            colors={["white", "blue"]} // Colors need to match the number of stops
            size={1024} // Size is optional, default = 1024
          /> */}
        </meshStandardMaterial>
        {/* <meshBasicMaterial >
          <GradientTexture
            stops={[0, 1]} // As many stops as you want
            colors={["aquamarine", "hotpink"]} // Colors need to match the number of stops
            size={1024} // Size is optional, default = 1024
          />
        </meshBasicMaterial> */}
      </mesh>
    </>
  );
});

export default PushSpot;
