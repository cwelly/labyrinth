import { ITile } from "./Objects/ITile.jsx";
import { LTile } from "./Objects/LTile.jsx";
import { OTile } from "./Objects/OTile.jsx";
import coordinates from "../constant/BoardCoordinates.js";
import React, {
  useRef,
  useState,
  useEffect,
  Suspense,
  forwardRef,
} from "react";
import { PieceTest } from "./Objects/PieceTest.jsx";
import { DragControls } from "@react-three/drei";
import PushSpot from "./Objects/PushSpot.jsx";
// import { Physics ,useRapier} from "@react-three/rapier";
import { PhysicsITile } from "./Objects/PhysicsITile.jsx";
import * as THREE from 'three';


// 1. 움직이는 타일이 바닥 밑으로 안내려가게
// 2. 구체가 아니라 탑뷰로 봤을때 엄청 크게하기
// 3. 각 타일을 하나로 묶어서 변경사항 생길때마다 바꾸지 않게 하기



// 타일을 밀어 넣을 수있는 위치 좌표 모음
let push_spot_coordinates = [
  { key: 1, x: 8.2, y: -4.1, z: 0 },
  { key: 2, x: 8.2, y: 0, z: 0 },
  { key: 3, x: 8.2, y: 4.1, z: 0 },
  { key: 4, x: 4.1, y: 8.2, z: 0 },
  { key: 5, x: 0, y: 8.2, z: 0 },
  { key: 6, x: -4.1, y: 8.2, z: 0 },
  { key: 7, x: -8.2, y: 4.1, z: 0 },
  { key: 8, x: -8.2, y: 0, z: 0 },
  { key: 9, x: -8.2, y: -4.1, z: 0 },
  { key: 10, x: -4.1, y: -8.2, z: 0 },
  { key: 11, x: 0, y: -8.2, z: 0 },
  { key: 12, x: 4.1, y: -8.2, z: 0 },
];

// 서버에서 받아온 각 좌표에 대한 타일 및 방향 정보
let server_side_tile_infos = [
  { type: "L", dir: 0 },
  { type: "L", dir: 1 },
  { type: "O", dir: 0 },
  { type: "I", dir: 0 },
  { type: "O", dir: 0 },
  { type: "I", dir: 0 },
  { type: "L", dir: 1 },
  { type: "L", dir: 0 },
  { type: "O", dir: 2 },
  { type: "L", dir: 1 },
  { type: "I", dir: 1 },
  { type: "L", dir: 3 },
  { type: "O", dir: 2 },
  { type: "O", dir: 2 },
  { type: "O", dir: 3 },
  { type: "L", dir: 0 },
  { type: "O", dir: 3 },
  { type: "I", dir: 0 },
  { type: "O", dir: 0 },
  { type: "I", dir: 0 },
  { type: "O", dir: 1 },
  { type: "L", dir: 3 },
  { type: "L", dir: 1 },
  { type: "L", dir: 1 },
  { type: "L", dir: 0 },
  { type: "O", dir: 0 },
  { type: "L", dir: 1 },
  { type: "I", dir: 1 },
  { type: "O", dir: 3 },
  { type: "I", dir: 0 },
  { type: "O", dir: 2 },
  { type: "I", dir: 1 },
  { type: "O", dir: 1 },
  { type: "L", dir: 3 },
  { type: "O", dir: 1 },
  { type: "L", dir: 3 },
  { type: "I", dir: 0 },
  { type: "L", dir: 1 },
  { type: "L", dir: 0 },
  { type: "I", dir: 1 },
  { type: "L", dir: 0 },
  { type: "L", dir: 0 },
  { type: "L", dir: 3 },
  { type: "I", dir: 0 },
  { type: "O", dir: 2 },
  { type: "I", dir: 0 },
  { type: "O", dir: 2 },
  { type: "O", dir: 2 },
  { type: "L", dir: 2 },
];

// 타일의 방향을 준다면 , 그대로 불러온 회전시킬 좌표를 리턴하는 메소드
function clock_way_rotate(dir) {
  if (dir === 1) {
    return [0, (3 * Math.PI) / 2, 0];
  } else if (dir === 2) {
    return [0, Math.PI, 0];
  } else if (dir === 3) {
    return [0, Math.PI / 2, 0];
  } else {
    return [0, 0, 0];
  }
}

// 서버에서 받은 자료를 기반으로 리턴할 메소드까지 계산하는 메소드
function cal_tile_Object(server_side_tile_infos, tile_scale) {
  // 각 좌표의 정확한 좌표값과 , 서버에서 온 좌표마다의 타일 위치를 매칭하는 부분
  return coordinates
    .map((coordinate) => ({
      ...coordinate,
      tile_type: server_side_tile_infos[coordinate.key - 1].type,
      tile_dir: server_side_tile_infos[coordinate.key - 1].dir,
    }))
    .map((temp_tile) => {
      if (temp_tile.tile_type === "L") {
        return (
          <LTile
            key={temp_tile.key}
            position={[temp_tile.x, temp_tile.z, temp_tile.y]}
            rotation={clock_way_rotate(temp_tile.tile_dir)}
            scale={tile_scale}
          />
        );
      } else if (temp_tile.tile_type === "I") {
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
}





// function GameObejcts(cameraRef , isTurn = true){
const GameObejcts = forwardRef(({ cameraRef, isTurn = true }, ...props) => {
// const GameObejcts = forwardRef(( props,ref) => {
  const tile_scale = [1, 0.1, 1];
  const meeple_scale = [0.2, 0.2, 0.2];
  const [tilesCoordinates, setTileCoordinates] = useState(null);
  const rigidRef = useRef();
  const prevPosition = useRef(new THREE.Vector3());
  // 구독 및 pub 됐을때 실행하는 useEffect
  useEffect(() => {
    const updateTiles = (tilesCoordinates) => {
      setTileCoordinates(tilesCoordinates);
    };
    // 구독정보 추가되면 삭제할 부분
    setTileCoordinates(cal_tile_Object(server_side_tile_infos, tile_scale));
    return () => {};
  }, [server_side_tile_infos]);
  // useEffect(() => {
  //   const updateBoard = (newBoardState) => {
  //     setBoard(newBoardState);
  //   };

  //   const unsubscribe = subscribe('boardUpdate', updateBoard);

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // 드래그 시작할때를 알아차리기 위한 변수
  const [isDraged, setIsDraged] = useState(false);

  // 만약 플레이어가 현재 차례라면
  if ( isTurn) {
    // const pushSpot = push_spot_coordinates.map((push_spot_coordinate) => {});
  }

  return (
    <Suspense fallback={null}>
      {tilesCoordinates}

        
        <DragControls
          onDragStart={(e) => {
            cameraRef.current.getCamera().enabled = false;
            setIsDraged(true);
            prevPosition.current.copy({x:e.x-8,y:e.y+3,z:e.z});
            // console.log(e)
          }}
          
          onDrag={(e)=>{
            
          }}


          onDragEnd={() => {
            cameraRef.current.getCamera().enabled = true;
            // console.log(rigidRef.current.getRigidBody())
            setIsDraged(false);
          }}
        >
          <PhysicsITile    isDraged={isDraged} position={[-8, 3, 0]} scale={tile_scale} />
        </DragControls>
        <PushSpot
          position={[
            push_spot_coordinates[0].x,
            push_spot_coordinates[0].z,
            push_spot_coordinates[0].y,
          ]}
        ></PushSpot>

      <PieceTest
        position={[coordinates[0].x, 0.303, coordinates[0].y]}
        scale={meeple_scale}
        color="blue"
      />
      <PieceTest
        position={[coordinates[6].x, 0.303, coordinates[6].y]}
        scale={meeple_scale}
        color="red"
      />
      <PieceTest
        position={[coordinates[42].x, 0.303, coordinates[42].y]}
        scale={meeple_scale}
        color="yellow"
      />
      <PieceTest
        position={[coordinates[48].x, 0.303, coordinates[48].y]}
        scale={meeple_scale}
        color="green"
      />
    </Suspense>
  );
});
// }
export default GameObejcts;
// 내턴이 끝날때 실행하게 될 메소드
// publish('boardUpdate', newBoardState);
