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
  useImperativeHandle,
} from "react";
import { PieceTest } from "./Objects/PieceTest.jsx";
import { DragControls, useKeyboardControls } from "@react-three/drei";
import PushSpot from "./Objects/PushSpot.jsx";
import { PhysicsITile } from "./Objects/PhysicsITile.jsx";
import * as THREE from "three";
import { DragedTile } from "./Objects/DragedTile.js";

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
  { type: "O", dir: 0, target: "A" },
  { type: "I", dir: 0 },
  { type: "O", dir: 0, target: "B" },
  { type: "I", dir: 0 },
  { type: "L", dir: 1 },
  { type: "L", dir: 0 },
  { type: "O", dir: 2, target: "C" },
  { type: "L", dir: 1, target: "D" },
  { type: "I", dir: 1 },
  { type: "L", dir: 3 },
  { type: "O", dir: 2, target: "E" },
  { type: "O", dir: 2, target: "F" },
  { type: "O", dir: 3, target: "G" },
  { type: "L", dir: 0, target: "H" },
  { type: "O", dir: 3, target: "I" },
  { type: "I", dir: 0, target: "J" },
  { type: "O", dir: 0, target: "K" },
  { type: "I", dir: 0 },
  { type: "O", dir: 1, target: "L" },
  { type: "L", dir: 3 },
  { type: "L", dir: 1 },
  { type: "L", dir: 1, target: "M" },
  { type: "L", dir: 0 },
  { type: "O", dir: 0, target: "N" },
  { type: "L", dir: 1 },
  { type: "I", dir: 1 },
  { type: "O", dir: 3, target: "O" },
  { type: "I", dir: 0 },
  { type: "O", dir: 2, target: "P" },
  { type: "I", dir: 1 },
  { type: "O", dir: 1, target: "Q" },
  { type: "L", dir: 3 },
  { type: "O", dir: 1, target: "R" },
  { type: "L", dir: 3 },
  { type: "I", dir: 0 },
  { type: "L", dir: 1 },
  { type: "L", dir: 0, target: "S" },
  { type: "I", dir: 1 },
  { type: "L", dir: 0, target: "T" },
  { type: "L", dir: 0, target: "U" },
  { type: "L", dir: 3 },
  { type: "I", dir: 0 },
  { type: "O", dir: 2, target: "V" },
  { type: "I", dir: 0 },
  { type: "O", dir: 2, target: "W" },
  { type: "O", dir: 2, target: "X" },
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

const Pieces = forwardRef((props, ref) => {
  const { PieceInfo, MeepleScale } = props;
  // 게임말들을 렌더링할 컴포넌트
  return PieceInfo.map((info) => {
    return (
      <PieceTest
        key={info.key}
        ref={(el) => {
          ref.current[info.key] = el;
        }}
        position={[
          coordinates[info.coordinate].x,
          0.303,
          coordinates[info.coordinate].y,
        ]}
        scale={MeepleScale}
        color={info.color}
        userData={{ coordinate: info.coordinate, key: info.key }}
      />
    );
  });
});

// 서버에서 받은 자료를 기반으로 리턴할 메소드까지 계산하는 메소드
const GameBoard = forwardRef((props, ref) => {
  const {
    server_side_tile_infos,
    tile_scale,
    handlePieceMove,
    targetAnimations,
  } = props;
  return coordinates
    .map((coordinate) => ({
      ...coordinate,
      tile_type: server_side_tile_infos[coordinate.key - 1].type,
      tile_dir: server_side_tile_infos[coordinate.key - 1].dir,
      tile_target: server_side_tile_infos[coordinate.key - 1].target,
    }))
    .map((temp_tile, index) => {
      if (temp_tile.tile_type === "L") {
        return (
          <LTile
            ref={(el) => {
              if (el) {
                ref.current[temp_tile.key] = el;
              }
            }}
            key={temp_tile.key}
            position={[temp_tile.x, temp_tile.z, temp_tile.y]}
            rotation={clock_way_rotate(temp_tile.tile_dir)}
            scale={tile_scale}
            userData={{
              coordinate: temp_tile.key - 1,
              target: temp_tile.tile_target,
            }}
            onClick={handlePieceMove}
          // targetAnimation={targetAnimations[index]}
          />
        );
      } else if (temp_tile.tile_type === "I") {
        return (
          <ITile
            ref={(el) => {
              if (el) {
                ref.current[temp_tile.key] = el;
              }
            }}
            key={temp_tile.key}
            position={[temp_tile.x, temp_tile.z, temp_tile.y]}
            rotation={clock_way_rotate(temp_tile.tile_dir)}
            scale={tile_scale}
            userData={{
              coordinate: temp_tile.key - 1,
              target: temp_tile.tile_target,
            }}
            onClick={handlePieceMove}
          // targetAnimation={targetAnimations[index]}
          />
        );
      } else {
        return (
          <OTile
            ref={(el) => {
              if (el) {
                ref.current[temp_tile.key] = el;
              }
            }}
            key={temp_tile.key}
            position={[temp_tile.x, temp_tile.z, temp_tile.y]}
            rotation={clock_way_rotate(temp_tile.tile_dir)}
            scale={tile_scale}
            userData={{
              coordinate: temp_tile.key - 1,
              target: temp_tile.tile_target,
            }}
            onClick={handlePieceMove}
          // targetAnimation={targetAnimations[index]}
          />
        );
      }
    });
});
// 타일을 둘자리에 보기용으로 생기는 타일
function gen_tile({ dir, position, type, scale, target, ref }) {
  // 초기화 제대로 안되었다면 out

  if (!(position === undefined)) {
    if (type === "L") {
      return (
        <LTile
          ref={ref}
          position={[position.x, position.y, position.z]}
          rotation={clock_way_rotate(dir)}
          scale={scale}
          userData={{
            target: target,
          }}
        />
      );
    } else if (type === "I") {
      return (
        <ITile
          ref={ref}
          position={[position.x, position.y, position.z]}
          // position={position}
          rotation={clock_way_rotate(dir)}
          scale={scale}
          userData={{
            target: target,
          }}
        />
      );
    } else {
      return (
        <OTile
          ref={ref}
          position={[position.x, position.y, position.z]}
          // position={position}
          rotation={clock_way_rotate(dir)}
          scale={scale}
          userData={{
            target: target,
          }}
        />
      );
    }
  }
}
// function GameObejcts(cameraRef , isTurn = true){
// const GameObejcts = forwardRef(
//   ({ onTileConfirmButton, cameraRef, isTurn = true }, ...props) => {
const GameObejcts = forwardRef((props, ref) => {
  const { state, cameraRef, isTurn = true } = props;
  const {
    turnInfo,
    setTurnInfo,
    handleTileConfirm,
    tileConfirmButton,
    pieceConfirmButton,
    setPieceConfirmButton,
    warningPosition,
    setWarningPosition,
    userInfo, setUserInfo,
    myPieceInfo ,setMyPieceInfo,
  } = state;
  // // 현재 클라이언트의 닉네임을 기록하기 위한 state
  // const [myPieceInfo, setMyPieceInfo] = useState({ nickName: "Sam" });
  // 현재 게임말이 접근 가능한 좌표 모음 state
  const [availableCoordinate, setAvailableCoordinate] = useState();
  // 현재 타일들의 접근 가능한 여부를 저장한 state
  const [reachableDir, setReachableDir] = useState();
  // 게임말이 이동할 경로를 저장하는state
  const [way, setWay] = useState();
  const tile_scale = [1, 0.1, 1];
  const meeple_scale = [0.2, 0.2, 0.2];
  const pushSpotRefs = useRef([]);
  const dragTileRef = useRef();
  const gameBoardRef = useRef([]);
  const piecesRef = useRef([]);
  //현재 차례의 어느 순간인지 정보를 알기위한 state
  // 0 : 내 차례 아님
  // 1 : 내 차례, 타일 이동 중
  // 2 : 내 차례, 타일 확정후 타일 움직이는 중
  // 3 : 내 차례 , 말 이동 중
  // 4: 내 차례 , 말 확정 후 말 움직이는 중
  // 다른 사람의 드래그 타일의 위치를 정하는 state
  const [dragTilePosition, setDragTilePosition] = useState(
    new THREE.Vector3(0, 2, 0)
  );
  // 게임말의 정보를 서버에서 받아오는 정보
  // const [userInfo, setUserInfo] = new useState(testGamePieceInfo);
  // 타일 확정후 , 움직이는 오브젝트들을 저장하는 state
  const [moveObjects, setMoveObjects] = useState({
    tile: [],
    piece: [],
    target: [],
  });
  // 목표target이 움직일지를 결정하는 state
  // const [targetAnimations, setTargetAnimations] = useState(new Array(49).fill(""));
  // const targetAnimationss = new Array(49).fill("");

  // 드래그 타일의 타겟을 정하는 state
  const [dragTileTarget, setDragTileTarget] = useState();
  // 드래그 타일의 타입을 정하는 state
  const [dragTileType, setDragTileType] = useState("I");
  // 드래그 타일의 회전값을 제어하기 위한 state
  const [dragTileDir, setDragTileDir] = useState(0);
  // 드래그 시작할때를 알아차리기 위한 변수
  const [isDraged, setIsDraged] = useState(false);
  // 키입력에 딜레이를 주기위한 state
  const [keyDelay, setKeyDelay] = useState(0);
  const [pieceMoveDelay, setPieceMoveDelay] = useState(0);
  // 타일 확정 후 애니메이션을 제어하기 위한 변수
  const [objectMoveDelay, setObjectMoveDelay] = useState(0);
  // 사용자의 키입력을 확인하기 위한 control
  const [, get] = useKeyboardControls();
  // 서버에서 온 타일들의 정보를 기록하는 state
  const [serverTileInfo, setServerTileInfo] = useState(server_side_tile_infos);
  // dragTile의 매트릭스 값을 사용하기 위한 매트릭스 값
  const [dragMatrix, setDragMatrix] = useState(new THREE.Matrix4());
  const [confirmTileInfo, setConfirmTileInfo] = useState({ isVisible: true });

  useFrame((state, delta) => {
    // 사용자의 입력 대입
    const { clock, antiClock } = get();
    // 타일 애니메이션 체크
    if (objectMoveDelay !== 0) {
      // 종료조건
      if (objectMoveDelay < 0) {
        // 현재 차례 상태를 다음으로 넘긴다
        setTurnInfo(3);
        // 현재 바뀐 타일들 기반으로 , 클라이언트의 게임말이 움직일 수 있는 칸을 계산
        calculateAvailableCoordinates(serverTileInfo);
        // 움직임을 초기화
        setObjectMoveDelay(0);
        // 게임말을 확정할 건지 물어본다
        setPieceConfirmButton(true);
      }
      // 실행조건
      else {
        if (confirmTileInfo.position.x === 8.2) {
          // 123
          // 타일 처리
          const movingTiles = gameBoardRef?.current
            .filter((tile) =>
              moveObjects.tile.includes(tile.getTile().userData.coordinate)
            )
            .map((tile) => tile.getTile());
          if (movingTiles && movingTiles.length > 0) {
            movingTiles.map(
              (tile) =>
              (tile.position.x =
                coordinates[tile.userData.coordinate].x + objectMoveDelay)
            );
          }
          // 게임말 처리
          const movingPieces = piecesRef?.current.filter((piece) =>
            moveObjects.piece.includes(piece.userData.key)
          );
          if (movingPieces && movingPieces.length > 0) {
            movingPieces.map(
              (piece) =>
              (piece.position.x =
                coordinates[piece.userData.coordinate].x + objectMoveDelay)
            );
          }
          // 조건에 맞는위치로 초기화
          const pushSpotIndex =
            confirmTileInfo.position.z === -4.1
              ? 8
              : confirmTileInfo.position.z === 0
                ? 7
                : 6;
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[pushSpotIndex].x + objectMoveDelay,
              dragTilePosition.y,
              dragTilePosition.z
            )
            //   {
            //   ...dragTilePosition,
            //   x: push_spot_coordinates[pushSpotIndex].x + objectMoveDelay,
            // }
          );
        } else if (confirmTileInfo.position.x === -8.2) {
          /// 789
          // 타일 처리
          const movingTiles = gameBoardRef?.current
            .filter((tile) =>
              moveObjects.tile.includes(tile.getTile().userData.coordinate)
            )
            .map((tile) => tile.getTile());
          if (movingTiles && movingTiles.length > 0) {
            movingTiles.map(
              (tile) =>
              (tile.position.x =
                coordinates[tile.userData.coordinate].x - objectMoveDelay)
            );
          }
          // 게임말 처리
          const movingPieces = piecesRef?.current.filter((piece) =>
            moveObjects.piece.includes(piece.userData.key)
          );
          if (movingPieces && movingPieces.length > 0) {
            movingPieces.map(
              (piece) =>
              (piece.position.x =
                coordinates[piece.userData.coordinate].x - objectMoveDelay)
            );
          }
          // 조건에 맞는위치로 초기화
          const pushSpotIndex =
            confirmTileInfo.position.z === -4.1
              ? 0
              : confirmTileInfo.position.z === 0
                ? 1
                : 2;
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[pushSpotIndex].x - objectMoveDelay,
              dragTilePosition.y,
              dragTilePosition.z
            )
            //   {
            //   ...dragTilePosition,
            //   x: push_spot_coordinates[pushSpotIndex].x - objectMoveDelay,
            // }
          );
        } else if (confirmTileInfo.position.z === 8.2) {
          // 456
          // 타일 처리
          const movingTiles = gameBoardRef?.current
            .filter((tile) =>
              moveObjects.tile.includes(tile.getTile().userData.coordinate)
            )
            .map((tile) => tile.getTile());
          // console.log( movingTiles)
          if (movingTiles && movingTiles.length > 0) {
            movingTiles.map(
              (tile) =>
              (tile.position.z =
                coordinates[tile.userData.coordinate].y + objectMoveDelay)
            );
          }
          // 게임말 처리
          const movingPieces = piecesRef?.current.filter((piece) =>
            moveObjects.piece.includes(piece.userData.key)
          );
          if (movingPieces && movingPieces.length > 0) {
            movingPieces.map(
              (piece) =>
              (piece.position.z =
                coordinates[piece.userData.coordinate].y + objectMoveDelay)
            );
          }
          // 조건에 맞는위치로 초기화
          const pushSpotIndex =
            confirmTileInfo.position.x === -4.1
              ? 9
              : confirmTileInfo.position.x === 0
                ? 10
                : 11;
          setDragTilePosition(
            new THREE.Vector3(
              dragTilePosition.x,
              dragTilePosition.y,
              push_spot_coordinates[pushSpotIndex].y + objectMoveDelay
            )
            //   {
            //   ...dragTilePosition,
            //   z: push_spot_coordinates[pushSpotIndex].y + objectMoveDelay,
            // }
          );
        } else if (confirmTileInfo.position.z === -8.2) {
          // 10 11 12
          // 타일 처리
          const movingTiles = gameBoardRef?.current
            .filter((tile) =>
              moveObjects.tile.includes(tile.getTile().userData.coordinate)
            )
            .map((tile) => tile.getTile());
          if (movingTiles && movingTiles.length > 0) {
            movingTiles.map(
              (tile) =>
              (tile.position.z =
                coordinates[tile.userData.coordinate].y - objectMoveDelay)
            );
          }
          // 게임말 처리
          const movingPieces = piecesRef?.current.filter((piece) =>
            moveObjects.piece.includes(piece.userData.key)
          );
          if (movingPieces && movingPieces.length > 0) {
            movingPieces.map(
              (piece) =>
              (piece.position.z =
                coordinates[piece.userData.coordinate].y - objectMoveDelay)
            );
          }
          // 조건에 맞는위치로 초기화
          const pushSpotIndex =
            confirmTileInfo.position.x === -4.1
              ? 5
              : confirmTileInfo.position.x === 0
                ? 4
                : 3;
          setDragTilePosition(
            new THREE.Vector3(
              dragTilePosition.x,
              dragTilePosition.y,
              push_spot_coordinates[pushSpotIndex].y - objectMoveDelay
            )
            //   {
            //   ...dragTilePosition,
            //   z: push_spot_coordinates[pushSpotIndex].y - objectMoveDelay,
            // }
          );
        } else {
          console.log("뭔가 이상해 confirmTileInfo 가 이상해");
        }
        // console.log(moveObjects)
        setObjectMoveDelay(objectMoveDelay - delta);
      }
    }

    // 회전값들어왔다면
    if (turnInfo === 1 && clock) {
      if (keyDelay === 0) {
        setKeyDelay(1);
        setDragTileDir((dragTileDir + 1) % 4);
        setConfirmTileInfo({ ...confirmTileInfo, dir: dragTileDir });
      }
      // setTimeout(()=>{animationControls={...animationControls,clock:undefined}},1000);
    } else if (turnInfo === 1 && antiClock) {
      if (keyDelay === 0) {
        setKeyDelay(1);
        setDragTileDir((4 + dragTileDir - 1) % 4);
        setConfirmTileInfo({ ...confirmTileInfo, dir: dragTileDir });
      }
    }
    if (keyDelay > 1.5) {
      setKeyDelay(0);
    } else if (keyDelay > 0) {
      setKeyDelay(keyDelay + delta);
    }

    // 게임말 애니메이션

    if (turnInfo === 4) {
      if (way.length === 1 && pieceMoveDelay < 0) {
        // 다 끝난 경우
        setPieceMoveDelay(0);
        gameBoardRef?.current[myPieceInfo.coordinate + 1].setAnimation("up");
        setTurnInfo(3);
        setPieceConfirmButton(true);
      } else {
        if (pieceMoveDelay < 0) {
          setWay((prev) => prev.slice(1));
          setPieceMoveDelay(2.05);
        } else {
          // 이동 시키기
          // 아직 게임말 좌표가 안바뀌었다면 바꾸기
          if (myPieceInfo.coordinate !== way[0].way) {
            console.log(myPieceInfo.coordinate + 1, "바뀌기 전 좌표");
            gameBoardRef?.current[myPieceInfo.coordinate + 1].setAnimation(
              "down"
            );
            setUserInfo((prev) =>
              prev.map((piece) =>
                piece.nickName === myPieceInfo.nickName
                  ? { ...piece, coordinate: way[0].way }
                  : piece
              )
            );
            console.log("바뀐후 내 말 정보 :", myPieceInfo.coordinate + 1);
            // 게임말이 target에 접근할때
            // target 을 올려보낸다.
            // if (gameBoardRef.current&&gameBoardRef.current[myPieceInfo.coordinate + 1].getTile().userData.target!==undefined) {
            if (
              gameBoardRef.current &&
              gameBoardRef.current[way[0].way + 1].getTile()
                .userData.target !== undefined
            ) {
              console.log(
                gameBoardRef.current[myPieceInfo.coordinate + 1].getTile()
                  .userData,
                "이동 시키는 좌표의 정보입니다.",
                way[0]
              );
              gameBoardRef?.current[way[0].way + 1].setAnimation("up");
            }
          }
          // delay만큼 이동 시킨값으로 표현
          if (way[0].dir === "up") {
            piecesRef?.current
              .filter((piece) => myPieceInfo.key === piece.userData.key)
              .map((piece) => {
                if (myPieceInfo.coordinate === way[0].way) {
                  piece.position.x =
                    coordinates[myPieceInfo.coordinate].x - pieceMoveDelay;
                }
              });
          } else if (way[0].dir === "down") {
            piecesRef?.current
              .filter((piece) => myPieceInfo.key === piece.userData.key)
              .map((piece) => {
                if (myPieceInfo.coordinate === way[0].way) {
                  piece.position.x =
                    coordinates[myPieceInfo.coordinate].x + pieceMoveDelay;
                }
              });
          } else if (way[0].dir === "left") {
            piecesRef?.current
              .filter((piece) => myPieceInfo.key === piece.userData.key)
              .map((piece) => {
                if (myPieceInfo.coordinate === way[0].way) {
                  piece.position.z =
                    coordinates[myPieceInfo.coordinate].y + pieceMoveDelay;
                }
              });
          } else {
            piecesRef?.current
              .filter((piece) => myPieceInfo.key === piece.userData.key)
              .map((piece) => {
                if (myPieceInfo.coordinate === way[0].way) {
                  piece.position.z =
                    coordinates[myPieceInfo.coordinate].y - pieceMoveDelay;
                }
              });
          }
          setPieceMoveDelay(pieceMoveDelay - delta * 10);
        }
      }
    }

    // 자기 차례이고 , 타일 밀장소(pushSpot) 과 드래그 하고 있는 타일(dragTile)
    // 자신의 드래그 타일과 둘장소가 겹치는 지 확인하는 로직
    if (isTurn && pushSpotRefs.current && dragTileRef.current) {
      pushSpotRefs.current.reduce(
        (acc, item) => {
          if (acc?.skip) {
            return acc;
          }
          // 각 장소마다 겹치는 범위를 확인
          if (item?.getPushSpot() !== undefined) {
            const boxA = new THREE.Box3().setFromObject(item.getPushSpot());
            const boxB = new THREE.Box3().setFromObject(
              dragTileRef.current.getDragTile()
            );
            // 겹친다면 겹치는 정도를 확인
            if (boxA.intersectsBox(boxB)) {
              const intersection = new THREE.Box3();
              intersection.copy(boxA);

              intersection.intersect(boxB);

              const intersectionVolume =
                intersection.getSize(new THREE.Vector3()).x *
                intersection.getSize(new THREE.Vector3()).y *
                intersection.getSize(new THREE.Vector3()).z;

              const dragTileVolume =
                boxB.getSize(new THREE.Vector3()).x *
                boxB.getSize(new THREE.Vector3()).y *
                boxB.getSize(new THREE.Vector3()).z;

              const overlapPercentage =
                (intersectionVolume / dragTileVolume) * 100;
              // 일정 수준 이상 들어왔다면?
              if (overlapPercentage > 30) {
                // 여기서 움직이는 타일은 isVisible=false,
                // 해당 좌표에 확정타일을 생성토록 정보를 넘겨준다.
                // console.log(item.getPushSpot())
                setConfirmTileInfo({
                  isVisible: false,
                  dir: dragTileDir,
                  position: {
                    x: item.getPushSpot().position.x,
                    y: item.getPushSpot().position.y - 150,
                    z: item.getPushSpot().position.z,
                  },
                  // type: dragTileRef.current.getDragTile().customData.type,
                  type: dragTileType,
                  target: dragTileTarget,
                });
              } else {
                setConfirmTileInfo({
                  isVisible: true,
                });
              }
              acc.skip = true;
            }

            return acc;
          }
        },
        { skip: false }
      );
    }
  });

  // 구독 및 pub 됐을때 실행하는 useEffect
  useEffect(() => {
    // const updateTiles = (tilesCoordinates) => {
    //   setTileCoordinates(tilesCoordinates);
    // };
    // 구독정보 추가되면 삭제할 부분
    // setTileCoordinates(cal_tile_Object(server_side_tile_infos, tile_scale));
    setServerTileInfo(server_side_tile_infos);

    return () => { };
  }, []);

  // 첫 렌더링 할 때 게임말이 목표와 겹칠때 올려두기
  useEffect(() => {
    if (gameBoardRef?.current > 0) {
      console.log(gameBoardRef)
      userInfo.map((piece) => {
        // 목표가 존재할 경우
        if (serverTileInfo[piece.coordinate].target !== undefined) {
          gameBoardRef?.current[piece.coordinate].setAnimation("up");
        }
      })
    }
  }, [serverTileInfo])
  // 자신의 말의 위치를 갱신하기
  useEffect(() => {
    setMyPieceInfo(
      userInfo.filter((piece) => piece.nickName === myPieceInfo.nickName)[0]
    );
  }, [userInfo]);

  // 차례정보를 따라가는 useEffect
  useEffect(() => {
    console.log("차례가 바뀌었습니다 !", turnInfo, isTurn);
    console.log(
      "현재 보드 상태입니다",
      gameBoardRef.current.map((tile) => tile.getTile().userData)
    );
  }, [turnInfo]);
  // pushSpot을 만드는 컴포넌트로 빼자
  const pushTileCoordinates = push_spot_coordinates.map((coordinate) => {
    return (
      <PushSpot
        ref={(el) => {
          pushSpotRefs.current[coordinate.key] = el;
        }}
        key={coordinate.key}
        position={[coordinate.x, coordinate.y, coordinate.z]}
      />
    );
  });
  // GameObject와 UI 를 연결하는 로직
  useImperativeHandle(ref, () => ({
    // 타일을 확정하고 미는 로직
    tilePush() {
      // console.log("타일이 확정되었습니다 ! : ", confirmTileInfo);
      // console.log("현재 보드 상황입니다 ", gameBoardRef?.current);
      // console.log("서버에서 받아온 정보입니다 ", serverTileInfo);
      // 타일들도 위치 처리
      if (confirmTileInfo.position.x === 8.2) {
        // console.log("1, 2, 3 상단 이군요? , 파랑-빨강");
        if (confirmTileInfo.position.z === -4.1) {
          // 1번
          // 1번 인덱스 친구부터해서 +7 위치로 옮기기, 원래 1번 친구는 Drag타일의 정보를 넣기
          // 마지막 43번 친구는 DragTile Type이 되면 됨
          setDragTileType(serverTileInfo[43].type);
          setDragTileDir(serverTileInfo[43].dir);
          //추가
          setDragTileTarget(serverTileInfo[43].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[8].x + 2.05,
              push_spot_coordinates[8].z,
              push_spot_coordinates[8].y
            )
          );
          // 현재 움직이는 오브젝트들의 Ref를 받아서 애니메이션에서 활용할 예정
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 1 && i !== 1) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 7].type,
                dir: serverTileInfo[i - 7].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i - 7].target
                  ? serverTileInfo[i - 7].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(1);
          newServerTileInfo[1] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 1; index < 49; index += 7) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 43) {
                  return { ...piece, coordinate: 1 };
                } else {
                  return { ...piece, coordinate: index + 7 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          // 찾아보자
          setMoveObjects(newMoveObjects);
        } else if (confirmTileInfo.position.z === 0) {
          // 2번
          setDragTileType(serverTileInfo[45].type);
          setDragTileDir(serverTileInfo[45].dir);
          //추가
          setDragTileTarget(serverTileInfo[45].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[7].x + 2.05,
              push_spot_coordinates[7].z,
              push_spot_coordinates[7].y
            )
          );

          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 3 && i !== 3) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 7].type,
                dir: serverTileInfo[i - 7].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i - 7].target
                  ? serverTileInfo[i - 7].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(3);
          newServerTileInfo[3] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 3; index < 49; index += 7) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 45) {
                  return { ...piece, coordinate: 3 };
                } else {
                  return { ...piece, coordinate: index + 7 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else {
          // 3번
          setDragTileType(serverTileInfo[47].type);
          setDragTileDir(serverTileInfo[47].dir);
          //target
          setDragTileTarget(serverTileInfo[47].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[6].x + 2.05,
              push_spot_coordinates[6].z,
              push_spot_coordinates[6].y
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 5 && i !== 5) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 7].type,
                dir: serverTileInfo[i - 7].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i - 7].target
                  ? serverTileInfo[i - 7].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(5);
          newServerTileInfo[5] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 5; index < 49; index += 7) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 47) {
                  return { ...piece, coordinate: 5 };
                } else {
                  return { ...piece, coordinate: index + 7 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        }
      } else if (confirmTileInfo.position.x === -8.2) {
        console.log("9 , 8 , 7 하단 이군요 ? 노랑-초록");
        if (confirmTileInfo.position.z === -4.1) {
          // 9
          setDragTileType(serverTileInfo[1].type);
          setDragTileDir(serverTileInfo[1].dir);
          //target
          setDragTileTarget(serverTileInfo[1].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[0].x - 2.05,
              push_spot_coordinates[0].z,
              push_spot_coordinates[0].y
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 1 && i !== 43) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 7].type,
                dir: serverTileInfo[i + 7].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i + 7].target
                  ? serverTileInfo[i + 7].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(43);
          newServerTileInfo[43] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 43; index > 0; index -= 7) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 1) {
                  return { ...piece, coordinate: 43 };
                } else {
                  return { ...piece, coordinate: index - 7 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else if (confirmTileInfo.position.z === 0) {
          // 8
          setDragTileType(serverTileInfo[3].type);
          setDragTileDir(serverTileInfo[3].dir);
          //target
          setDragTileTarget(serverTileInfo[3].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[1].x - 2.05,
              push_spot_coordinates[1].z,
              push_spot_coordinates[1].y
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 3 && i !== 45) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 7].type,
                dir: serverTileInfo[i + 7].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i + 7].target
                  ? serverTileInfo[i + 7].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(45);
          newServerTileInfo[45] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 45; index > 0; index -= 7) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 3) {
                  return { ...piece, coordinate: 45 };
                } else {
                  return { ...piece, coordinate: index - 7 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else {
          // 7
          setDragTileType(serverTileInfo[5].type);
          setDragTileDir(serverTileInfo[5].dir);
          //target
          setDragTileTarget(serverTileInfo[5].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[2].x - 2.05,
              push_spot_coordinates[2].z,
              push_spot_coordinates[2].y
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 5 && i !== 47) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 7].type,
                dir: serverTileInfo[i + 7].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i + 7].target
                  ? serverTileInfo[i + 7].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(47);
          newServerTileInfo[47] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 47; index > 0; index -= 7) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 5) {
                  return { ...piece, coordinate: 47 };
                } else {
                  return { ...piece, coordinate: index - 7 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        }
      } else if (confirmTileInfo.position.z === 8.2) {
        console.log("4, 5, 6 우측 이군요 ? 빨강-초록");
        if (confirmTileInfo.position.x === 4.1) {
          //4
          setDragTileType(serverTileInfo[7].type);
          setDragTileDir(serverTileInfo[7].dir);
          //target
          setDragTileTarget(serverTileInfo[7].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[11].x,
              push_spot_coordinates[11].z,
              push_spot_coordinates[11].y + 2.05
            )
          );

          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 6 && i < 13) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 1].type,
                dir: serverTileInfo[i + 1].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i + 1].target
                  ? serverTileInfo[i + 1].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(13);
          newServerTileInfo[13] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 13; index > 6; index -= 1) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 7) {
                  return { ...piece, coordinate: 13 };
                } else {
                  return { ...piece, coordinate: index - 1 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else if (confirmTileInfo.position.x === 0) {
          //5
          setDragTileType(serverTileInfo[21].type);
          setDragTileDir(serverTileInfo[21].dir);
          //target
          setDragTileTarget(serverTileInfo[21].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[10].x,
              push_spot_coordinates[10].z,
              push_spot_coordinates[10].y + 2.05
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 20 && i < 27) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 1].type,
                dir: serverTileInfo[i + 1].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i + 1].target
                  ? serverTileInfo[i + 1].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(27);
          newServerTileInfo[27] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 27; index > 20; index -= 1) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 21) {
                  return { ...piece, coordinate: 27 };
                } else {
                  return { ...piece, coordinate: index - 1 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else {
          //6
          setDragTileType(serverTileInfo[35].type);
          setDragTileDir(serverTileInfo[35].dir);
          //target
          setDragTileTarget(serverTileInfo[35].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[9].x,
              push_spot_coordinates[9].z,
              push_spot_coordinates[9].y + 2.05
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 34 && i < 41) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 1].type,
                dir: serverTileInfo[i + 1].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i + 1].target
                  ? serverTileInfo[i + 1].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(41);
          newServerTileInfo[41] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 41; index > 34; index -= 1) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 35) {
                  return { ...piece, coordinate: 41 };
                } else {
                  return { ...piece, coordinate: index - 1 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        }
      } else if (confirmTileInfo.position.z === -8.2) {
        console.log("10, 11 , 12 좌측 이군요 ?  파랑-노랑");
        if (confirmTileInfo.position.x === -4.1) {
          // 10
          setDragTileType(serverTileInfo[41].type);
          setDragTileDir(serverTileInfo[41].dir);
          //target
          setDragTileTarget(serverTileInfo[41].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[5].x,
              push_spot_coordinates[5].z,
              push_spot_coordinates[5].y - 2.05
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 35 && i < 42) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 1].type,
                dir: serverTileInfo[i - 1].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i - 1].target
                  ? serverTileInfo[i - 1].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(35);
          newServerTileInfo[35] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 35; index < 42; index += 1) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 41) {
                  return { ...piece, coordinate: 35 };
                } else {
                  return { ...piece, coordinate: index + 1 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else if (confirmTileInfo.position.x === 0) {
          // 11
          setDragTileType(serverTileInfo[27].type);
          setDragTileDir(serverTileInfo[27].dir);
          //target
          setDragTileTarget(serverTileInfo[27].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[4].x,
              push_spot_coordinates[4].z,
              push_spot_coordinates[4].y - 2.05
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 21 && i < 28) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 1].type,
                dir: serverTileInfo[i - 1].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i - 1].target
                  ? serverTileInfo[i - 1].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(21);
          newServerTileInfo[21] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 21; index < 28; index += 1) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 27) {
                  return { ...piece, coordinate: 21 };
                } else {
                  return { ...piece, coordinate: index + 1 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else {
          // 12
          setDragTileType(serverTileInfo[13].type);
          setDragTileDir(serverTileInfo[13].dir);
          //target
          setDragTileTarget(serverTileInfo[13].target);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[3].x,
              push_spot_coordinates[3].z,
              push_spot_coordinates[3].y - 2.05
            )
          );
          const newMoveObjects = { tile: [], piece: [] };
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 7 && i < 14) {
              newMoveObjects.tile.push(i);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 1].type,
                dir: serverTileInfo[i - 1].dir,
                // 여기에 target을 추가
                target: serverTileInfo[i - 1].target
                  ? serverTileInfo[i - 1].target
                  : undefined,
              };
            }
            return tileInfo;
          });
          newMoveObjects.tile.push(7);
          newServerTileInfo[7] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
            target: confirmTileInfo.target,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = userInfo.map((piece) => {
            for (let index = 7; index < 14; index += 1) {
              if (piece.coordinate === index) {
                newMoveObjects.piece.push(piece.key);
                if (index === 13) {
                  return { ...piece, coordinate: 7 };
                } else {
                  return { ...piece, coordinate: index + 1 };
                }
              }
            }
            return piece;
          });
          setUserInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        }
      }
      // useFrame에 사용할 Animation 값 초기화(useFrame으로 처리할 준비)

      setObjectMoveDelay(2.05);
    },
    // 게임말의 위치를 확정하고 다음 상태로 넘어가는 로직
    pieceConfirm() {
      console.log(myPieceInfo, "여기 맞죠?");
      setTurnInfo(1);
      setDragMatrix(new THREE.Matrix4());
      setPieceConfirmButton(false);
    },
  }));

  // 이동위치 판단하는 펑션
  function calculateAvailableCoordinates(serverTileInfos) {
    // 각 좌표에서 인접 타일로 갈 수 있는지를 저장하는 배열
    const availables = [];
    for (let index = 0; index < 49; index++) {
      const availableDirection = {};
      const tile = serverTileInfos[index];
      availableDirection.dir = tile.dir;
      availableDirection.type = tile.type;
      // 상
      if (index - 7 >= 0) {
        availableDirection.up = availables[index - 7].down;
      } else {
        availableDirection.up = false;
      }
      // 좌
      if (index % 7 !== 0 && index - 1 >= 0) {
        availableDirection.left = availables[index - 1].right;
      } else {
        availableDirection.left = false;
      }
      // 아랫쪽에 타일이 존재하는 지 체크
      if (index + 7 < 49) {
        const downTile = serverTileInfos[index + 7];
        if (
          //현재 타일 조건
          ((tile.type === "L" && (tile.dir === 0 || tile.dir === 1)) ||
            (tile.type === "O" && tile.dir !== 2) ||
            (tile.type === "I" && (tile.dir === 1 || tile.dir === 3))) &&
          // 아랫 타일 조건
          ((downTile.type === "L" &&
            (downTile.dir === 2 || downTile.dir === 3)) ||
            (downTile.type === "O" && downTile.dir !== 0) ||
            (downTile.type === "I" &&
              (downTile.dir === 1 || downTile.dir === 3)))
        ) {
          availableDirection.down = true;
        } else {
          availableDirection.down = false;
        }
      } else {
        availableDirection.down = false;
      }
      // 우
      if (index % 7 !== 6 && index + 1 < 49) {
        const rightTile = serverTileInfos[index + 1];
        if (
          // 현재 타일 조건
          ((tile.type === "L" && (tile.dir === 0 || tile.dir === 3)) ||
            (tile.type === "O" && tile.dir !== 1) ||
            (tile.type === "I" && (tile.dir === 0 || tile.dir === 2))) &&
          // 오른쪽 타일의 조건
          ((rightTile.type === "L" &&
            (rightTile.dir === 1 || rightTile.dir === 2)) ||
            (rightTile.type === "O" && rightTile.dir !== 3) ||
            (rightTile.type === "I" &&
              (rightTile.dir === 0 || rightTile.dir === 2)))
        ) {
          availableDirection.right = true;
        } else {
          availableDirection.right = false;
        }
      } else {
        availableDirection.right = false;
      }

      availables.push(availableDirection);
    }

    // 현재 자신의 게임말의 좌표 가져오기
    const currentIndex = myPieceInfo.coordinate;
    const newAvailableCoordinate = [];
    //  bfs 돌리기
    //bfs시작
    const queue = [currentIndex];
    const visited = new Set();
    visited.add(currentIndex);
    const reachable = [];
    while (queue.length > 0) {
      const currentIdx = queue.shift();
      reachable.push(currentIdx);
      // 현재 좌표에 상하좌우 확인
      if (availables[currentIdx]?.up && !visited.has(currentIdx - 7)) {
        const nextIdx = currentIdx - 7;
        queue.push(nextIdx);
        visited.add(nextIdx);
      }
      if (availables[currentIdx]?.down && !visited.has(currentIdx + 7)) {
        const nextIdx = currentIdx + 7;

        queue.push(nextIdx);
        visited.add(nextIdx);
      }
      if (availables[currentIdx]?.left && !visited.has(currentIdx - 1)) {
        const nextIdx = currentIdx - 1;
        queue.push(nextIdx);
        visited.add(nextIdx);
      }
      if (availables[currentIdx]?.right && !visited.has(currentIdx + 1)) {
        const nextIdx = currentIdx + 1;
        queue.push(nextIdx);
        visited.add(nextIdx);
      }
    }

    // 최종적으론 각 좌표마다 갈 수 있는 좌표들을 저장할 배열
    // ex)  [ [1,3,5,6,7] , [1,2,3,5] , .... ]
    setAvailableCoordinate(reachable);
    setReachableDir(availables);
    console.log(availables, "각 포지션에서 갈 수 있는 위치");
    console.log(reachable, "현재 갈 수 있는 좌표들");
  }

  // 게임말이 움직일수 있도록 하는 메소드
  const handlePieceMove = (tile) => {
    // console.log(tile)
    // target이라면 넘겨
    tile.stopPropagation();

    const targetCoordinate = tile?.object.parent.userData.coordinate;

    // 해당 타일로 이동가능한지 판별
    // 필요한건 serverTileinfo와 현재 피스의 위치
    if (availableCoordinate.includes(targetCoordinate)) {
      // 다른 말과 겹치는지 체크
      if (
        piecesRef?.current.filter(
          (object) =>
            object.userData.coordinate === targetCoordinate &&
            object.userData.key !== myPieceInfo.key
        ).length > 0
      ) {
        setWarningPosition(true);
      } else {
        //bfs시작
        const queue = [{ idx: myPieceInfo.coordinate, path: [] }];
        const visited = new Set();
        visited.add(myPieceInfo.coordinate);
        while (queue.length > 0) {
          const { idx, path } = queue.shift();
          if (idx === targetCoordinate) {
            // 움직이게 되는 경우
            if (path.length > 0) {
              setWay(path);
              setPieceMoveDelay(2.05);
              setPieceConfirmButton(false);
              setTurnInfo(4);
            }
            // console.log(path)
            break;
          }
          // 상
          // console.log(reachableDir,idx,"reDir,idx")
          if (reachableDir[idx].up && !visited.has(idx - 7)) {
            const nextIdx = idx - 7;
            queue.push({
              idx: nextIdx,
              path: [...path, { dir: "up", way: nextIdx }],
            });
            visited.add(nextIdx);
          }
          // 하
          if (reachableDir[idx].down && !visited.has(idx + 7)) {
            const nextIdx = idx + 7;
            queue.push({
              idx: nextIdx,
              path: [...path, { dir: "down", way: nextIdx }],
            });
            visited.add(nextIdx);
          }
          // 좌
          if (reachableDir[idx].left && !visited.has(idx - 1)) {
            const nextIdx = idx - 1;
            queue.push({
              idx: nextIdx,
              path: [...path, { dir: "left", way: nextIdx }],
            });
            visited.add(nextIdx);
          }
          // 우
          if (reachableDir[idx].right && !visited.has(idx + 1)) {
            const nextIdx = idx + 1;
            queue.push({
              idx: nextIdx,
              path: [...path, { dir: "right", way: nextIdx }],
            });
            visited.add(nextIdx);
          }
        }
      }
    } else {
      setWarningPosition(true);
    }
  };

  return (
    <Suspense fallback={null}>
      {/* {tilesCoordinates} */}
      <GameBoard
        ref={gameBoardRef}
        server_side_tile_infos={serverTileInfo}
        tile_scale={tile_scale}
        handlePieceMove={isTurn && turnInfo === 3 ? handlePieceMove : undefined}
      // target의 애니메이션을 다룰 state
      // targetAnimations={targetAnimations}
      />
      {turnInfo === 1 && pushTileCoordinates}
      {turnInfo === 1 && (
        <DragControls
          matrix={dragMatrix}
          // 타일이 이사한곳으로 못나가도록 제한
          dragLimits={[
            [-10.0 - dragTilePosition.x, 10.0 - dragTilePosition.x],
            [0.5 - dragTilePosition.y, 9 - dragTilePosition.y],
            [-9.0 - dragTilePosition.z, 9.0 - dragTilePosition.z],
          ]}
          onDragStart={(e) => {
            cameraRef.current.getCamera().enabled = false;
            setIsDraged(true);
            // 이건 나중에 생각해보자
            handleTileConfirm(false);
          }}
          onDragEnd={(e) => {
            cameraRef.current.getCamera().enabled = true;
            setIsDraged(false);
            // 만약 유저가 해당위치에 두었다면 안보이는 상태로 그좌표로 이동시켜야함
            if (!(confirmTileInfo.isVisible === true)) {
              const translationMatrix = new THREE.Matrix4();
              translationMatrix.makeTranslation(0, 0, 0);
             const nowTile = dragTileRef.current.getDragTile();
            setDragTilePosition(new THREE.Vector3(confirmTileInfo.position.x,confirmTileInfo.position.y,confirmTileInfo.position.z));
              // console.log(nowTile, "현재값\n", confirmTileInfo,"state의 값\n",dragTilePosition);
              setDragMatrix(translationMatrix);
              handleTileConfirm(true);
            }
          }}
        >
          <DragedTile
            ref={dragTileRef}
            isDraged={isDraged}
            position={dragTilePosition}
            rotation={clock_way_rotate(dragTileDir)}
            scale={tile_scale}
            isVisible={confirmTileInfo.isVisible}
            type={dragTileType}
            target={dragTileTarget}
          ></DragedTile>
        </DragControls>
      )}

      {turnInfo === 1 &&
        !(confirmTileInfo.isVisible === true) &&
        gen_tile({
          dir: confirmTileInfo.dir,
          position: confirmTileInfo.position,
          type: confirmTileInfo.type,
          scale: tile_scale,
          target: dragTileTarget,
        })}
      {
        // 타일을 밀었을때 , 튀어나온 드래그 타일
        turnInfo !== 1 &&
        gen_tile({
          dir: dragTileDir,
          position: dragTilePosition,
          type: dragTileType,
          scale: tile_scale,
          target: dragTileTarget,
        })
      }
      <Pieces
        ref={piecesRef}
        PieceInfo={userInfo}
        MeepleScale={meeple_scale}
      />
    </Suspense>
  );
});
// }
export default GameObejcts;
// 내턴이 끝날때 실행하게 될 메소드
// publish('boardUpdate', newBoardState);
