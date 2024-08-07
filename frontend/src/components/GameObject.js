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
let testGamePieceInfo = [
  { key: 1, nickName: "Mike", color: "red", coordinate: 1 },
  { key: 2, nickName: "Sam", color: "blue", coordinate: 7 },
  { key: 3, nickName: "Susie", color: "green", coordinate: 42 },
  { key: 4, nickName: "Kai", color: "yellow", coordinate: 49 },
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

// 타일이 확정되고 밀어버리는 메소드
function tilePush({ props }) {
  console.log(props, "여긴 tilePush");

  // 필요한 정보?
  // 어디에서 어디로 밀건지( 시작점 만 알면 미는 방향과 좌표들을 알 수 있다! ) 
  // -> key값 혹은 좌표값
  // draggble tile 의 type 
  // PieceInfo 처리 ( 마지막에 있다면 처음부분으로 보낸다.)
  // server_side_tile_infos 설정 바꾸고
  // useFrame 에서 사용할 Animation 설정
  // ex if(turnInfo==2&& PushAnimation==0)



  // - 바뀌고 퍼블리싱할 정보
  // 바뀐 게임말들의 위치  (PieceInfo)
  // 드래그 하게될 타일 정보 
  // 바뀐 타일 좌표 ( server_side_tile_infos)
}

// 게임말들을 렌더링할 컴포넌트
function Pieces({ PieceInfo,MeepleScale }) {
  return PieceInfo.map((info) => {
    return (
      <PieceTest
        position={[coordinates[info.coordinate-1].x, 0.303, coordinates[info.coordinate-1].y]}
        scale={MeepleScale}
        color={info.color}
      />
    );
  });
}

// 서버에서 받은 자료를 기반으로 리턴할 메소드까지 계산하는 메소드
function GameBoard({ server_side_tile_infos, tile_scale }) {
  // console.log(server_side_tile_infos,"server_side")
  // console.log(tile_scale,"tile_Scale")
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
  const { turnInfo, setTurnInfo, handleTileConfirm, tileConfirmButton } = state;
  const tile_scale = [1, 0.1, 1];
  const meeple_scale = [0.2, 0.2, 0.2];
  const pushSpotRefs = useRef([]);
  const dragTileRef = useRef();
  //현재 차례의 어느 순간인지 정보를 알기위한 state
  // 0 : 내 차례 아님
  // 1 : 내 차례, 타일 이동 중
  // 2 : 내 차례, 타일 확정후 타일 움직이는 중
  // 3 : 내 차례 , 말 이동 중
  // 4: 내 차례 , 말 확정 후 말 움직이는 중
  // 키입력에 딜레이를 주기위한 state
  const [keyDelay, setKeyDelay] = useState(0);
  // 사용자의 키입력을 확인하기 위한 control
  const [, get] = useKeyboardControls();
  // 드래그 시작할때를 알아차리기 위한 변수
  const [isDraged, setIsDraged] = useState(false);
  // 서버에서 온 타일들의 정보를 기록하는 state
  const [serverTileInfo, setServerTileInfo] = useState(server_side_tile_infos);
  // dragTile의 매트릭스 값을 사용하기 위한 매트릭스 값
  const [dragMatrix, setDragMatrix] = useState(new THREE.Matrix4());
  // 드래그 타일의 회전값을 제어하기 위한 state
  const [dragTileDir, setDragTileDir] = useState(0);
  const [confirmTileInfo, setConfirmTileInfo] = useState({ isVisible: true });
  useFrame((state, delta) => {
    // 사용자 입력이 들어왔는지 확인
    const { clock, antiClock } = get();
    // 회전값들어왔다면
    if (clock) {
      if (keyDelay === 0) {
        setKeyDelay(1);
        setDragTileDir((dragTileDir + 1) % 4);
        setConfirmTileInfo({ ...confirmTileInfo, dir: dragTileDir });
      }
      // setTimeout(()=>{animationControls={...animationControls,clock:undefined}},1000);
    } else if (antiClock) {
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
      dragTileRef.current &&
      dragTileRef.current.getDragTile().customData
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
                  type: dragTileRef.current.getDragTile().customData.type,
                });
              } else {
                setConfirmTileInfo({
                  isVisible: true,
                });
              }
              // onTileConfirmButton({
              //   isVisible: true,
              //   tilePosition: item.getPushSpot().position,
              //   tileDir: overlapPercentage,
              //   tileType: dragTileRef.current.getDragTile().customData.type,
              // });
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

  useImperativeHandle(ref, () => ({
    tilePush() {
      console.log("GameBoard function executed!");
      // 여기에 원하는 로직을 추가합니다.
      // 일단 게임말 위치 처리. (useFrame으로 처리할 준비)
      // 타일들도 위치 처리 (useFrame으로 처리할 준비)
      // useFrame에 사용할 Animation 값 초기화
    },
  }));

  return (
    <Suspense fallback={null}>
      {/* {tilesCoordinates} */}
      <GameBoard
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
