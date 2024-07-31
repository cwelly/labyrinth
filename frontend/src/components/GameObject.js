import { ITile } from "./ITile";
import { LTile } from "./LTile";
import { OTile } from "./OTile";
import coordinates from "../constant/BoardCoordinates.js";
import React, {  Suspense,forwardRef,useEffect  } from "react";
import { PieceTest } from "./PieceTest.jsx";
import { DragControls } from "@react-three/drei";
let temp_tiles=[];
let server_side_tile_coordinates=[
  {type:'L',dir:0},{type:'L',dir:1},{type:'O',dir:0},{type:'I',dir:0},{type:'O',dir:0},{type:'I',dir:0},{type:'L',dir:1},
  {type:'L',dir:0},{type:'O',dir:2},{type:'L',dir:1},{type:'I',dir:1},{type:'L',dir:3},{type:'O',dir:2},{type:'O',dir:2},
  {type:'O',dir:3},{type:'L',dir:0},{type:'O',dir:3},{type:'I',dir:0},{type:'O',dir:0},{type:'I',dir:0},{type:'O',dir:1},
  {type:'L',dir:3},{type:'L',dir:1},{type:'L',dir:1},{type:'L',dir:0},{type:'O',dir:0},{type:'L',dir:1},{type:'I',dir:1},
  {type:'O',dir:3},{type:'I',dir:0},{type:'O',dir:2},{type:'I',dir:1},{type:'O',dir:1},{type:'L',dir:3},{type:'O',dir:1},
  {type:'L',dir:3},{type:'I',dir:0},{type:'L',dir:1},{type:'L',dir:0},{type:'I',dir:1},{type:'L',dir:0},{type:'L',dir:0},
  {type:'L',dir:3},{type:'I',dir:0},{type:'O',dir:2},{type:'I',dir:0},{type:'O',dir:2},{type:'O',dir:2},{type:'L',dir:2}
];

function clock_way_rotate(dir){
  if(dir===1){
    return [0,3* Math.PI / 2, 0];
  }
  else if(dir===2){
    return [0, Math.PI , 0];
  }
  else if(dir===3) {
    return [0, Math.PI / 2, 0];
  }
  else{
    return [0,0,0];
  }
}

// function GameObejcts(){
const GameObejcts = forwardRef(({cameraRef} , ref)=> {
  const tile_scale = [1, 0.1, 1];
  const meeple_scale=[0.2,0.2,0.2];
  temp_tiles = coordinates.map(coordinate =>({
    ...coordinate,
    tile_type: server_side_tile_coordinates[coordinate.key-1].type,
    tile_dir: server_side_tile_coordinates[coordinate.key-1].dir
  })
  );
  //모든 타일의 크기가 2/2/2 로 같다고 가정하고 작성
  
  // 부모에게서 가져온 카메라 Ref를 담는다
  useEffect(() => {
    if (cameraRef.current) {
      const camera = cameraRef.current.getCamera();
      console.log(camera); // 카메라 참조를 사용하는 로직
    }
  }, [cameraRef]);


  // 여기에 서버에서 가져온 각 좌표마다의 타일을 넣을 예정
  const tile_list = temp_tiles.map((temp_tile) => {
    if (temp_tile.tile_type  === 'L') {
      return (
        <LTile
          key={temp_tile.key}
          position={[temp_tile.x, temp_tile.z, temp_tile.y]}
          rotation={clock_way_rotate(temp_tile.tile_dir)}
          scale={tile_scale}
        />
      );
    } else if (temp_tile.tile_type  === 'I') {
      return (
        <ITile
          key={temp_tile.key}
          position={[temp_tile.x, temp_tile.z, temp_tile.y]}
          rotation={clock_way_rotate(temp_tile.tile_dir)}
          scale={tile_scale}
        />
      );
    } else {
      return (
        <OTile
          key={temp_tile.key}
          position={[temp_tile.x, temp_tile.z, temp_tile.y]}
          rotation={clock_way_rotate(temp_tile.tile_dir)}
          scale={tile_scale}
        />
      );
    }
  });
  return <Suspense fallback={null}>
    {tile_list}
    <DragControls onDragStart={()=>{cameraRef.current.getCamera().enabled=false}} onDragEnd={()=>{cameraRef.current.getCamera().enabled=true}} >
      <ITile position={[-8,3,0]} scale={tile_scale}/>
    </DragControls>
    
    <PieceTest position={[ temp_tiles[0].x,0.303 ,temp_tiles[0].y]} scale={meeple_scale} color="blue"/>
    <PieceTest position={[ temp_tiles[6].x,0.303 ,temp_tiles[6].y]} scale={meeple_scale} color="red"/>
    <PieceTest position={[ temp_tiles[42].x,0.303 ,temp_tiles[42].y]} scale={meeple_scale} color="yellow"/>
    <PieceTest position={[ temp_tiles[48].x,0.303 ,temp_tiles[48].y]} scale={meeple_scale} color="green"/>
    </Suspense>;
});
export default GameObejcts;