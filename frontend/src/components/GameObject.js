import { ITile } from "./Objects/ITile.jsx";
import { LTile } from "./Objects/LTile.jsx";
import { OTile } from "./Objects/OTile.jsx";
import coordinates from "../constant/BoardCoordinates.js";
import { useThree, useFrame } from "@react-three/fiber";
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
let testGamePieceInfo = [
  { key: 1, nickName: "Mike", color: "red", coordinate: 2 },
  { key: 2, nickName: "Sam", color: "blue", coordinate: 14 },
  { key: 3, nickName: "Susie", color: "green", coordinate: 28 },
  { key: 4, nickName: "Kai", color: "yellow", coordinate: 42 },
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
          coordinates[info.coordinate - 1].x,
          0.303,
          coordinates[info.coordinate - 1].y,
        ]}
        scale={MeepleScale}
        color={info.color}
      />
    );
  });
});

// 서버에서 받은 자료를 기반으로 리턴할 메소드까지 계산하는 메소드
const GameBoard = forwardRef((props, ref) => {
  const { server_side_tile_infos, tile_scale } = props;
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
            ref={(el) => {
              ref.current[temp_tile.key] = el;
            }}
            key={temp_tile.key}
            position={[temp_tile.x, temp_tile.z, temp_tile.y]}
            rotation={clock_way_rotate(temp_tile.tile_dir)}
            scale={tile_scale}
          />
        );
      } else if (temp_tile.tile_type === "I") {
        return (
          <ITile
            ref={(el) => {
              ref.current[temp_tile.key] = el;
            }}
            key={temp_tile.key}
            position={[temp_tile.x, temp_tile.z, temp_tile.y]}
            rotation={clock_way_rotate(temp_tile.tile_dir)}
            scale={tile_scale}
          />
        );
      } else {
        return (
          <OTile
            ref={(el) => {
              ref.current[temp_tile.key] = el;
            }}
            key={temp_tile.key}
            position={[temp_tile.x, temp_tile.z, temp_tile.y]}
            rotation={clock_way_rotate(temp_tile.tile_dir)}
            scale={tile_scale}
          />
        );
      }
    });
});
// 타일을 둘자리에 보기용으로 생기는 타일
function gen_tile({ dir, position, type, scale, ref }) {
  // 초기화 제대로 안되었다면 out

  if (!(position === undefined)) {
    if (type === "L") {
      return (
        <LTile
          ref={ref}
          position={[position.x, position.y, position.z]}
          rotation={clock_way_rotate(dir)}
          scale={scale}
        />
      );
    } else if (type === "I") {
      return (
        <ITile
          ref={ref}
          position={[position.x, position.y, position.z]}
          rotation={clock_way_rotate(dir)}
          scale={scale}
        />
      );
    } else {
      return (
        <OTile
          ref={ref}
          position={[position.x, position.y, position.z]}
          rotation={clock_way_rotate(dir)}
          scale={scale}
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
  const { scene } = useThree();
  const { turnInfo, setTurnInfo, handleTileConfirm, tileConfirmButton } = state;
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
  const [dragTilePosition, setDragTilePosition] = useState({
    x: 0,
    y: 2,
    z: 0,
  });
  // 게임말의 정보를 서버에서 받아오는 정보
  const [piecesInfo, setPiecesInfo] = new useState(testGamePieceInfo);
  // 타일 확정후 , 움직이는 오브젝트들을 저장하는 state
  const [moveObjects, setMoveObjects] = useState([]);
  // 드래그 타일의 타입을 정하는 state
  const [dragTileType, setDragTileType] = useState("I");
  // 드래그 타일의 회전값을 제어하기 위한 state
  const [dragTileDir, setDragTileDir] = useState(0);
  // 드래그 시작할때를 알아차리기 위한 변수
  const [isDraged, setIsDraged] = useState(false);
  // 키입력에 딜레이를 주기위한 state
  const [keyDelay, setKeyDelay] = useState(0);
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
    // 사용자 입력이 들어왔는지 확인
    const { clock, antiClock } = get();

    // 타일 애니메이션 체크
    if (objectMoveDelay !== 0) {
      // 종료조건
      if (objectMoveDelay < 0) {
        setTurnInfo(3);
        setObjectMoveDelay(0);
      }
      // 실행조건
      else {
        // console.log("objectMoveDelay",objectMoveDelay, delta)
        if (confirmTileInfo.position.x === 8.2) {
          // 123
          moveObjects.map((object,i)=>{
            if(object.parent===null){
              object.parent=scene;
              console.log(object.position,"this.is.object.pos")
            }
            object.translateX(delta)
            object.updateMatrixWorld(true)
          })
        } else if (confirmTileInfo.position.x === -8.2) {
          /// 789
        } else if (confirmTileInfo.position.z === 8.2) {
          // 456
        } else if (confirmTileInfo.position.z === -8.2) {
          // 10 11 12
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

    // 자기 차례이고 , 타일 밀장소(pushSpot) 과 드래그 하고 있는 타일(dragTile)
    // 이 정상일때 확인
    if (
      isTurn &&
      pushSpotRefs.current &&
      dragTileRef.current
      // &&      dragTileRef.current.getDragTile().customData
    ) {
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

              const box1Volume =
                boxB.getSize(new THREE.Vector3()).x *
                boxB.getSize(new THREE.Vector3()).y *
                boxB.getSize(new THREE.Vector3()).z;

              const overlapPercentage = (intersectionVolume / box1Volume) * 100;
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
                });
              } else {
                setConfirmTileInfo({
                  isVisible: true,
                });
              }
              acc.skip = true;
            } else {
              // onTileConfirmButton({
              //   isVisible: false,
              //   tilePosition: "",
              //   tileDir: 0,
              //   tileType: "",
              // });
            }

            return acc;
          }
        },
        { skip: false }
      );
    }
  });

  // //드래그 할때 기둥에 들어가고 나오며 움직이는 타일이 보이는지 체크
  // useEffect(() => {
  //   if (confirmTileInfo.isVisible) {
  //     console.log("isVisible is true", confirmTileInfo);
  //   } else {
  //     console.log("isVisible is false", confirmTileInfo);
  //   }
  // }, [confirmTileInfo.isVisible]);

  // 구독 및 pub 됐을때 실행하는 useEffect
  useEffect(() => {
    // const updateTiles = (tilesCoordinates) => {
    //   setTileCoordinates(tilesCoordinates);
    // };
    // 구독정보 추가되면 삭제할 부분
    // setTileCoordinates(cal_tile_Object(server_side_tile_infos, tile_scale));
    setServerTileInfo(server_side_tile_infos);
    return () => {};
  }, []);

  // 차례정보를 따라가는 useEffect
  useEffect(() => {
    console.log("차례가 바뀌었습니다 !", turnInfo);
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
  // 단순한 정보 확인용
  useEffect(() => {
    console.log("moveObjects :", moveObjects); // 업데이트된 상태 값 출력
  }, [moveObjects]);

  useImperativeHandle(ref, () => ({
    // 타일을 확정하고 미는 로직
    tilePush() {
      console.log("타일이 확정되었습니다 ! : ", confirmTileInfo);
      console.log("현재 보드 상황입니다 ", gameBoardRef?.current);
      console.log("서버에서 받아온 정보입니다 ", serverTileInfo);
      // 여기에 원하는 로직을 추가합니다.
      // 일단 게임말 위치 처리. (useFrame으로 처리할 준비)
      // 타일들도 위치 처리
      if (confirmTileInfo.position.x === 8.2) {
        console.log("1, 2, 3 상단 이군요? , 파랑-빨강");
        if (confirmTileInfo.position.z == -4.1) {
          // 1번
          // 1번 인덱스 친구부터해서 +7 위치로 옮기기, 원래 1번 친구는 Drag타일의 정보를 넣기
          // 마지막 43번 친구는 DragTile Type이 되면 됨
          setDragTileType(serverTileInfo[43].type);
          setDragTileDir(serverTileInfo[43].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[8].x,
              push_spot_coordinates[8].z,
              push_spot_coordinates[8].y
            )
          );
          // 현재 움직이는 오브젝트들의 Ref를 받아서 애니메이션에서 활용할 예정
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 1 && i !== 1) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 7].type,
                dir: serverTileInfo[i - 7].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[2]);
          newServerTileInfo[1] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          console.log("before piece", moveObjects);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 1; index < 49; index += 7) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 43) {
                  return { ...piece, coordinate: 2 };
                } else {
                  return { ...piece, coordinate: index + 8 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          // 찾아보자
          setMoveObjects(newMoveObjects);
          // console.log(moveObjects,"moveObjects")
        } else if (confirmTileInfo.position.z == 0) {
          // 2번
          setDragTileType(serverTileInfo[45].type);
          setDragTileDir(serverTileInfo[45].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[7].x,
              push_spot_coordinates[7].z,
              push_spot_coordinates[7].y
            )
          );

          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 3 && i !== 3) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 7].type,
                dir: serverTileInfo[i - 7].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[4]);
          newServerTileInfo[3] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 3; index < 49; index += 7) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 45) {
                  return { ...piece, coordinate: 4 };
                } else {
                  return { ...piece, coordinate: index + 8 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else {
          // 3번
          setDragTileType(serverTileInfo[47].type);
          setDragTileDir(serverTileInfo[47].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[6].x,
              push_spot_coordinates[6].z,
              push_spot_coordinates[6].y
            )
          );
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 5 && i !== 5) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 7].type,
                dir: serverTileInfo[i - 7].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[6]);
          newServerTileInfo[5] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 5; index < 49; index += 7) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 47) {
                  return { ...piece, coordinate: 6 };
                } else {
                  return { ...piece, coordinate: index + 8 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        }
      } else if (confirmTileInfo.position.x === -8.2) {
        console.log("9 , 8 , 7 하단 이군요 ? 노랑-초록");
        if (confirmTileInfo.position.z === -4.1) {
          // 9
          setDragTileType(serverTileInfo[1].type);
          setDragTileDir(serverTileInfo[1].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[0].x,
              push_spot_coordinates[0].z,
              push_spot_coordinates[0].y
            )
          );
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 1 && i !== 43) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 7].type,
                dir: serverTileInfo[i + 7].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[44]);
          newServerTileInfo[43] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 43; index > 0; index -= 7) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 1) {
                  return { ...piece, coordinate: 44 };
                } else {
                  return { ...piece, coordinate: index - 6 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else if (confirmTileInfo.position.z === 0) {
          // 8
          setDragTileType(serverTileInfo[3].type);
          setDragTileDir(serverTileInfo[3].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[1].x,
              push_spot_coordinates[1].z,
              push_spot_coordinates[1].y
            )
          );
          const newMoveObjects = [];
          // newMoveObjects.push(gameBoardRef.current[i+1])
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 3 && i !== 45) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 7].type,
                dir: serverTileInfo[i + 7].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[46]);
          newServerTileInfo[45] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 45; index > 0; index -= 7) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 3) {
                  return { ...piece, coordinate: 46 };
                } else {
                  return { ...piece, coordinate: index - 6 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else {
          // 7
          setDragTileType(serverTileInfo[5].type);
          setDragTileDir(serverTileInfo[5].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[2].x,
              push_spot_coordinates[2].z,
              push_spot_coordinates[2].y
            )
          );
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i % 7 === 5 && i !== 47) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 7].type,
                dir: serverTileInfo[i + 7].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[48]);
          newServerTileInfo[47] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 47; index > 0; index -= 7) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 5) {
                  return { ...piece, coordinate: 48 };
                } else {
                  return { ...piece, coordinate: index - 6 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        }
      } else if (confirmTileInfo.position.z === 8.2) {
        console.log("4, 5, 6 우측 이군요 ? 빨강-초록");
        if (confirmTileInfo.position.x === 4.1) {
          //4
          setDragTileType(serverTileInfo[7].type);
          setDragTileDir(serverTileInfo[7].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[11].x,
              push_spot_coordinates[11].z,
              push_spot_coordinates[11].y
            )
          );

          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 6 && i < 13) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 1].type,
                dir: serverTileInfo[i + 1].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[14]);
          newServerTileInfo[13] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 13; index > 6; index -= 1) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 7) {
                  return { ...piece, coordinate: 14 };
                } else {
                  return { ...piece, coordinate: index };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else if (confirmTileInfo.position.x === 0) {
          //5
          setDragTileType(serverTileInfo[21].type);
          setDragTileDir(serverTileInfo[21].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[10].x,
              push_spot_coordinates[10].z,
              push_spot_coordinates[10].y
            )
          );
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 20 && i < 27) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 1].type,
                dir: serverTileInfo[i + 1].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[28]);
          newServerTileInfo[27] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 27; index > 20; index -= 1) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 21) {
                  return { ...piece, coordinate: 28 };
                } else {
                  return { ...piece, coordinate: index };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else {
          //6
          setDragTileType(serverTileInfo[35].type);
          setDragTileDir(serverTileInfo[35].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[9].x,
              push_spot_coordinates[9].z,
              push_spot_coordinates[9].y
            )
          );
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 34 && i < 41) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i + 1].type,
                dir: serverTileInfo[i + 1].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[42]);
          newServerTileInfo[41] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 41; index > 34; index -= 1) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 35) {
                  return { ...piece, coordinate: 42 };
                } else {
                  return { ...piece, coordinate: index };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        }
      } else if (confirmTileInfo.position.z === -8.2) {
        console.log("10, 11 , 12 좌측 이군요 ?  파랑-노랑");
        if (confirmTileInfo.position.x === -4.1) {
          // 10
          setDragTileType(serverTileInfo[41].type);
          setDragTileDir(serverTileInfo[41].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[5].x,
              push_spot_coordinates[5].z,
              push_spot_coordinates[5].y
            )
          );
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 35 && i < 42) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 1].type,
                dir: serverTileInfo[i - 1].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[36]);
          newServerTileInfo[35] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 35; index < 42; index += 1) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 41) {
                  return { ...piece, coordinate: 36 };
                } else {
                  return { ...piece, coordinate: index + 2 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else if (confirmTileInfo.position.x === 0) {
          // 11
          setDragTileType(serverTileInfo[27].type);
          setDragTileDir(serverTileInfo[27].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[4].x,
              push_spot_coordinates[4].z,
              push_spot_coordinates[4].y
            )
          );
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 21 && i < 28) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 1].type,
                dir: serverTileInfo[i - 1].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[22]);
          newServerTileInfo[21] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 21; index < 28; index += 1) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 27) {
                  return { ...piece, coordinate: 22 };
                } else {
                  return { ...piece, coordinate: index + 2 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        } else {
          // 12
          setDragTileType(serverTileInfo[13].type);
          setDragTileDir(serverTileInfo[13].dir);
          setDragTilePosition(
            new THREE.Vector3(
              push_spot_coordinates[3].x,
              push_spot_coordinates[3].z,
              push_spot_coordinates[3].y
            )
          );
          const newMoveObjects = [];
          const newServerTileInfo = serverTileInfo.map((tileInfo, i) => {
            if (i > 7 && i < 14) {
              newMoveObjects.push(gameBoardRef.current[i + 1]);
              // 그 라인의 열인경우
              return {
                ...tileInfo,
                type: serverTileInfo[i - 1].type,
                dir: serverTileInfo[i - 1].dir,
              };
            }
            return tileInfo;
          });
          newMoveObjects.push(gameBoardRef.current[8]);
          newServerTileInfo[7] = {
            type: confirmTileInfo.type,
            dir: confirmTileInfo.dir,
          };
          // console.log("바꿔봤습니다.", newServerTileInfo);
          // console.log("마지막 타일은 ? " ,dragTilePosition);
          setServerTileInfo(newServerTileInfo);
          // 이제 게임말을 체크해야함
          const newPieceInfo = piecesInfo.map((piece) => {
            for (let index = 7; index < 14; index += 1) {
              if (piece.coordinate - 1 === index) {
                newMoveObjects.push(piecesRef?.current[piece.key]);
                if (index === 13) {
                  return { ...piece, coordinate: 8 };
                } else {
                  return { ...piece, coordinate: index + 2 };
                }
              }
            }
            return piece;
          });
          setPiecesInfo(newPieceInfo);
          setMoveObjects(newMoveObjects);
        }
      }
      // useFrame에 사용할 Animation 값 초기화(useFrame으로 처리할 준비)
      setObjectMoveDelay(2.05);
    },
  }));

  return (
    <Suspense fallback={null}>
      {/* {tilesCoordinates} */}
      <GameBoard
        ref={gameBoardRef}
        server_side_tile_infos={serverTileInfo}
        tile_scale={tile_scale}
      />
      {turnInfo === 1 && pushTileCoordinates}
      {turnInfo === 1 && (
        <DragControls
          matrix={dragMatrix}
          // 타일이 이사한곳으로 못나가도록 제한
          dragLimits={[
            [-10.0, 10.0],
            [-2, 7],
            [-9.0, 9.0],
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
              translationMatrix.makeTranslation(
                confirmTileInfo.position.x,
                confirmTileInfo.position.y - 1,
                confirmTileInfo.position.z
              );
              setDragMatrix(translationMatrix);
              handleTileConfirm(true);
            }
          }}
        >
          <PhysicsITile
            ref={dragTileRef}
            isDraged={isDraged}
            position={new THREE.Vector3(0, 2, 0)}
            rotation={clock_way_rotate(dragTileDir)}
            scale={tile_scale}
            isVisible={confirmTileInfo.isVisible}
          />
        </DragControls>
      )}

      {
        // 미리보기 타일쓰
        // 얘는 언제 생성되는가?
        turnInfo === 1 &&
          !(confirmTileInfo.isVisible === true) &&
          gen_tile({
            dir: confirmTileInfo.dir,
            position: confirmTileInfo.position,
            type: confirmTileInfo.type,
            scale: tile_scale,
          })
      }
      {
        // 타일을 밀었을때 , 튀어나온 드래그 타일
        turnInfo === 2 &&
          gen_tile({
            dir: dragTileDir,
            position: dragTilePosition,
            type: dragTileType,
            scale: tile_scale,
          })
      }
      <Pieces
        ref={piecesRef}
        PieceInfo={piecesInfo}
        MeepleScale={meeple_scale}
      />
    </Suspense>
  );
});
// }
export default GameObejcts;
// 내턴이 끝날때 실행하게 될 메소드
// publish('boardUpdate', newBoardState);
