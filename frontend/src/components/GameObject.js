import { ITile } from "./Objects/ITile.jsx";
import { LTile } from "./Objects/LTile.jsx";
import { OTile } from "./Objects/OTile.jsx";
import coordinates from "../constant/BoardCoordinates.js";
import { useFrame } from "@react-three/fiber";
import React, {
  useRef,
  useState,
  useEffect,
  Suspense,
  forwardRef,
} from "react";
import { PieceTest } from "./Objects/PieceTest.jsx";
import { DragControls, Html } from "@react-three/drei";
import PushSpot from "./Objects/PushSpot.jsx";
import { PhysicsITile } from "./Objects/PhysicsITile.jsx";
import * as THREE from "three";
import { Container, Fullscreen, Text } from "@react-three/uikit";
import { isVisible } from "@testing-library/user-event/dist/utils/index.js";

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
function gen_tile({ dir, position, type, scale, ref }) {
  // 초기화 제대로 안되었다면 out

  if (!(position === undefined)) {
    if (type === "L") {
      return (
        <LTile
          ref={ref}
          position={[position[0], position[2], position[1]]}
          rotation={clock_way_rotate(dir)}
          scale={scale}
        />
      );
    } else if (type === "I") {
      return (
        <ITile
          ref={ref}
          position={[position[0], position[1], position[2]]}
          rotation={clock_way_rotate(dir)}
          scale={scale}
        />
      );
    } else {
      return (
        <OTile
          ref={ref}
          position={[position[0], position[2], position[1]]}
          rotation={clock_way_rotate(dir)}
          scale={scale}
        />
      );
    }
  }
}
// function GameObejcts(cameraRef , isTurn = true){
const GameObejcts = forwardRef(
  ({ onTileConfirmButton, cameraRef, isTurn = true }, ...props) => {
    // const GameObejcts = forwardRef(( props,ref) => {
    const tile_scale = [1, 0.1, 1];
    const meeple_scale = [0.2, 0.2, 0.2];
    const [tilesCoordinates, setTileCoordinates] = useState(null);
    const pushSpotRefs = useRef([]);
    const dragTileRef = useRef();
    const [pushSpotTarget,setPushSpotTarget] = useState();
    const [confirmTileInfo, setConfirmTileInfo] = useState({});
    const [dragTileDir, setDragTileDir] = useState(0);
    useFrame(() => {
      if (
        isTurn &&
        pushSpotRefs.current &&
        dragTileRef.current &&
        dragTileRef.current.getDragTile().customData
      ) {
        pushSpotRefs.current.reduce(
          (acc, item) => {
            if (acc?.skip) {
              return acc;
            }
            if (item?.getPushSpot() !== undefined) {
              const boxA = new THREE.Box3().setFromObject(item.getPushSpot());
              const boxB = new THREE.Box3().setFromObject(
                dragTileRef.current.getDragTile()
              );
              if (boxA.intersectsBox(boxB)) {
                const intersection = new THREE.Box3();
                intersection.copy(boxA);

                intersection.intersect(boxB);

                const intersectionVolume =
                  intersection.getSize(new THREE.Vector3()).x *
                  intersection.getSize(new THREE.Vector3()).y *
                  intersection.getSize(new THREE.Vector3()).z;

                const box1Volume =
                  boxB.getSize(new THREE.Vector3()).x *
                  boxB.getSize(new THREE.Vector3()).y *
                  boxB.getSize(new THREE.Vector3()).z;

                const overlapPercentage =
                  (intersectionVolume / box1Volume) * 100;
                // 일정 수준 이상 들어왔다면?
                if (overlapPercentage > 30) {
                  // 여기서 움직이는 타일은 isVisible=false,
                  // 해당 좌표에 확정타일을 생성토록 정보를 넘겨준다.
                  // console.log(item.getPushSpot())
                  setConfirmTileInfo({
                    isVisible: false,
                    dir: dragTileDir,
                    position: [
                      item.getPushSpot().position.x,
                      item.getPushSpot().position.y - 150,
                      item.getPushSpot().position.z,
                    ],
                    type: dragTileRef.current.getDragTile().customData.type,
                  });
                } else {
                  setConfirmTileInfo({
                    isVisible: true,
                  });
                }
                onTileConfirmButton({
                  isVisible: true,
                  tilePosition: item.getPushSpot().position,
                  tileDir: overlapPercentage,
                  tileType: dragTileRef.current.getDragTile().customData.type,
                });
                acc.skip = true;
              } else {
                onTileConfirmButton({
                  isVisible: false,
                  tilePosition: "",
                  tileDir: 0,
                  tileType: "",
                });
              }

              return acc;
            }
          },
          { skip: false }
        );
      }
    });

    useEffect(() => {
      if (confirmTileInfo.isVisible) {
        console.log("isVisible is true", confirmTileInfo);
      } else {
        console.log("isVisible is false", confirmTileInfo);
      }
    }, [confirmTileInfo.isVisible]);
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
    // console.log(onTileConfirmButton)
    const pushTileCoordinates = push_spot_coordinates.map((coordinate) => {
      return (
        <PushSpot
          ref={(el) => {
            pushSpotRefs.current[coordinate.key] = el;
          }}
          key={coordinate.key}
          position={[coordinate.x, coordinate.y, coordinate.z]}
          dragTileRef={dragTileRef}
          handleHover={onTileConfirmButton}
        />
      );
    });

    // 드래그 시작할때를 알아차리기 위한 변수
    const [isDraged, setIsDraged] = useState(false);

    // 만약 플레이어가 현재 차례라면
    // if (isTurn) {
    //   // const pushSpot = push_spot_coordinates.map((push_spot_coordinate) => {});
    //   if (pushSpotRef.current && dragTileRef.current) {
    //     const boxA = new THREE.Box3().setFromObject(pushSpotRef.current.getPushSpot())
    //     const boxB = new THREE.Box3().setFromObject(dragTileRef.current.getDragTile())
    //     if (boxA.intersectsBox(boxB)) {
    //       console.log("합격입니다!")

    //     }
    //   }
    // }

    return (
      <Suspense fallback={null}>
        {tilesCoordinates}
        {isTurn && pushTileCoordinates}
        {isTurn && (
          <DragControls
            // 타일이 이사한곳으로 못나가도록 제한
            dragLimits={[
              [-1.0, 17.0],
              [-3, 5],
              [-9.0, 9.0],
            ]}
            onDragStart={(e) => {
              cameraRef.current.getCamera().enabled = false;
              setIsDraged(true);
              // 이건 나중에 생각해보자
            }}
            onDragEnd={(e) => {
              cameraRef.current.getCamera().enabled = true;
              setIsDraged(false);
              // 만약 유저가 해당위치에 두었다면 안보이는 상태로 그좌표로 이동시켜야함
              if (!confirmTileInfo.isVisible) {
                
                dragTileRef.current.getDragTile().position.set(confirmTileInfo.position[0],confirmTileInfo.position[1],confirmTileInfo.position[2])
                console.log(dragTileRef.current.getDragTile().position)
              }
            }}
          >
            <PhysicsITile
              ref={dragTileRef}
              isDraged={isDraged}
              position={[-8, 3, 0]}
              rotation={clock_way_rotate(confirmTileInfo.dir)}
              scale={tile_scale}
              isVisible={confirmTileInfo.isVisible}
            />
          </DragControls>
        )}

        {
          // 미리보기 타일쓰
          // 얘는 언제 생성되는가?
          !(confirmTileInfo.isVisible === true) &&
            gen_tile({
              ref: pushSpotTarget,
              dir: confirmTileInfo.dir,
              position: confirmTileInfo.position,
              type: confirmTileInfo.type,
              scale: tile_scale,
            })
        }
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
  }
);
// }
export default GameObejcts;
// 내턴이 끝날때 실행하게 될 메소드
// publish('boardUpdate', newBoardState);
