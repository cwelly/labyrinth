import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ITile } from "./ITile";
import { OTile } from "./OTile";
import { LTile } from "./LTile";
export const DragedTile = forwardRef((props, ref) => {
  const dragTileRef = useRef();
  const { position, rotation, scale, isVisible, target, type ,isEdge,edgeColor} = props;
  useImperativeHandle(ref, () => ({
    getDragTile: () => dragTileRef.current.getTile(), 
  }));
  if (type === "L") {
    return (
      <LTile
        visible={isVisible === true}
        ref={dragTileRef}
        position={position}
        rotation={rotation}
        scale={scale}
        userData={{
          target: target,
        }}
        isEdge={isEdge}
        edgeColor={edgeColor}
      ></LTile>
    );
  }
  else if (type === "O") {
    return (
      <OTile
        visible={isVisible === true}
        ref={dragTileRef}
        position={position}
        rotation={rotation}
        scale={scale}
        userData={{
          target: target,
        }}
        isEdge={isEdge}
        edgeColor={edgeColor}
      ></OTile>
    );
  }
  else {
    return (
      <ITile
        visible={isVisible === true}
        ref={dragTileRef}
        position={position}
        rotation={rotation}
        scale={scale}
        userData={{
          target: target,
        }}
        isEdge={isEdge}
        edgeColor={edgeColor}
      ></ITile>

    );
  }
});
