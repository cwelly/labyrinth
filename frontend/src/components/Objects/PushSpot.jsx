import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
const PushSpot = forwardRef((props, ref) => {
  // function PushSpot({ ...props }) {
  const pushSpotRef = useRef();
  useImperativeHandle(ref, () => ({
    getPushSpot: () => pushSpotRef.current,
  }));
  return (
    <mesh
      ref={pushSpotRef}
      position={[props.position[0],  props.position[2]+150,props.position[1]]}
    >
      <boxGeometry args={[2, 300, 2]} />
      <meshStandardMaterial
        color="blue"
        transparent
        flatShading
        opacity={0.5}
      />
    </mesh>
  );
});

export default PushSpot;
