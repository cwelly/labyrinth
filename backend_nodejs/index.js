const express = require("express");
const http = require("http");

const app = express();
//cors 설정
var cors = require("cors");
app.use(cors());
app.use(express.json({ extended: true }));
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// 플레이어 정보 관리 변수
let players = {};
let color = ["red", "blue", "yellow", "green"];
// 인게임 관리 변수
let way = [];
let movingPiece = {};
let chatMassages=[];
let init_coordinates = [0, 6, 42, 48];
let current_player_num = 1;
let test_target=["G","L","V","W"];
let turnInfo = 0;
let whosTurn = 0;
let tileInfo = [];
let userInfo = [];
let spectator= [];
let dragTileInfo = {};
// players를 클라이언트에서 쓸수잇는 구조로 바꾸기
function getPlayerInfo(players) {
  return Object.keys(players).map((key) => {
    return { ...players[key] };
  });
}
// target을 분배하는 방법
const generateAlphabetArray = () => {
  return Array.from({ length: 24 }, (_, i) => String.fromCharCode(65 + i));
};
// 배열을 랜덤하게 섞는 함수
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
// 사람수를 넣으면 그수에 맞게 현재 players에 target을 배분하는 메소드
function targetRandomizer() {
  const pArray = Object.keys(players);
  const pcnt = pArray.length;
  const nBang = 24 / pcnt;
  const arr = shuffleArray(generateAlphabetArray());
  pArray.map((player, idx) => {
    players[player].targets = arr.slice(idx * nBang, (idx + 1) * nBang);
    players[player].coordinate = init_coordinates[idx];
  });
}
// 초기에 타일을 배치하는 코드
function tileRandomizer() {
  // 고정 타일
  const fixedTiles = [
    { type: "L", dir: 0 },
    {},
    { type: "O", dir: 0, target: "A" },
    {},
    { type: "O", dir: 0, target: "B" },
    {},
    { type: "L", dir: 1 },

    {},
    {},
    {},
    {},
    {},
    {},
    {},

    { type: "O", dir: 3, target: "G" },
    {},
    { type: "O", dir: 3, target: "I" },
    {},
    { type: "O", dir: 0, target: "K" },
    {},
    { type: "O", dir: 1, target: "L" },

    {},
    {},
    {},
    {},
    {},
    {},
    {},

    { type: "O", dir: 3, target: "O" },
    {},
    { type: "O", dir: 2, target: "P" },
    {},
    { type: "O", dir: 1, target: "Q" },
    {},
    { type: "O", dir: 1, target: "R" },

    {},
    {},
    {},
    {},
    {},
    {},
    {},

    { type: "L", dir: 3 },
    {},
    { type: "O", dir: 2, target: "V" },
    {},
    { type: "O", dir: 2, target: "W" },
    {},
    { type: "L", dir: 2 },
  ];
  // 변수 타일
  const variableTiles = [
    { type: "L", dir: 1 },
    { type: "I", dir: 0 },
    { type: "I", dir: 0 },

    { type: "L", dir: 0 },
    { type: "O", dir: 2, target: "C" },
    { type: "L", dir: 1, target: "D" },
    { type: "I", dir: 1 },
    { type: "L", dir: 3 },
    { type: "O", dir: 2, target: "E" },
    { type: "O", dir: 2, target: "F" },

    { type: "L", dir: 0, target: "H" },
    { type: "I", dir: 0, target: "J" },
    { type: "I", dir: 0 },

    { type: "L", dir: 3 },
    { type: "L", dir: 1 },
    { type: "L", dir: 1, target: "M" },
    { type: "L", dir: 0 },
    { type: "O", dir: 0, target: "N" },
    { type: "L", dir: 1 },
    { type: "I", dir: 1 },

    { type: "I", dir: 0 },
    { type: "I", dir: 1 },
    { type: "L", dir: 3 },

    { type: "L", dir: 3 },
    { type: "I", dir: 0 },
    { type: "L", dir: 1 },
    { type: "L", dir: 0, target: "S" },
    { type: "I", dir: 1 },
    { type: "L", dir: 0, target: "T" },
    { type: "L", dir: 0, target: "U" },

    { type: "I", dir: 0 },
    { type: "I", dir: 0 },
    { type: "O", dir: 2, target: "X" },

    { type: "I", dir: 0 },
  ];
  const shuffledArray = shuffleArray(variableTiles);
  const realShuffledArray = shuffledArray.map((elements) => {
    return { ...elements, dir: Math.floor(Math.random() * 4) };
  });
  const returnArray = fixedTiles.map((tile) => {
    if (Object.keys(tile).length === 0) {
      return variableTiles.shift();
    }
    return tile;
  });
  return { tileInfo: returnArray, dragTileInfo: variableTiles };
}
app.get("/reset", (req, res) => {
  players={}
  whosTurn=0;
  current_player_num=1;chatMassages=[];
  return res.status(200).send({ success: true, message: "리셋합니다"  });
});
app.get("/test", (req, res) => {
  const arr = tileRandomizer();
  return res
    .status(200)
    .send({ success: true, message: "테스트 값입니다", array: arr });
});
app.get("/game/init", (req, res) => {
  const answer = {};
  answer.whosTurn = whosTurn;
  answer.userInfo = userInfo;
  answer.tileInfo = tileInfo;
  answer.dragTileInfo = dragTileInfo;
  answer.turnInfo = turnInfo;
  answer.chatMassages = chatMassages;
  answer.way=way;
  // 예외상황 핸들러
  if (Object.keys(players).length < 2) {
    return res.status(400).send({
      success: false,
      message: "players가 이상합니다",
      players: players,
    });
  }
  return res
    .status(200)
    .send({ success: true, message: "정상적인 결과", answer: answer });
});
app.get("/players", (req, res) => {
  const playerInfo = Object.keys(players).map((key) => {
    return { ...players[key] };
  });
  return res
    .status(200)
    .send({ success: true, message: "처음 화면이네요", players: playerInfo });
});
// 로그인 요청하는 경우
app.post("/login", (req, res) => {
  const { nickname } = req.body;
  console.log(nickname, "로그인 시도");
  // 이미 있는 경우 (이 뒤에 현재 세션에 몇명인지 체크하는 방식으로 넘어가야함)
  if (nickname in players) {
    // 재접속하는 경우
    // 임시로 무력화 해두었음 || 부분부터 지우면 원상복구
    if (players[nickname].isActive === false || players[nickname].isActive) {
      players[nickname].isActive = true;
      console.log("재 로그인 성공");
      return res.status(200).send({
        loginedNickname: nickname,
        success: true,
        message: "다시 어서오세요",
        players: players,
        whosTurn:whosTurn,
      });
    } else {
      return res.status(400).send({
        loginedNickname: nickname,
        success: false,
        message: "이미 접속한 사람이 있습니다",
        whosTurn:whosTurn,
      });
    }
  }
  // 없는 경우
  else if (!(nickname in players) && Object.keys(players).length < 4) {
    // 추가로 들어온 경우
    players[nickname] = {
      key: current_player_num,
      color: color[current_player_num - 1],
      nickName: nickname,
      isReady: false,
      isActive: true,
      whosTurn:whosTurn,
    };
    current_player_num += 1;
    const playerInfo = Object.keys(players).map((key) => {
      return { ...players[key] };
    });
    console.log("로그인 성공", getPlayerInfo(players));
    io.emit("updatePlayers", getPlayerInfo(players));
    return res.status(200).send({
      loginedNickname: nickname,
      success: true,
      message: "처음 어서오세요",
      players: players,
      whosTurn:whosTurn,
    });
  } 
  else if(!(nickname in players)){
    // 관전의 경우
    spectator.push({nickname:nickname});
    return res.status(200).send({
      spectator: nickname,
      success: true,
      message: "관전자 이시네요",
      players:  players,
      whosTurn: whosTurn,
    });

  }
  else {
    return res.status(400).send({
      loginedNickname: nickname,
      success: false,
      whosTurn:whosTurn,
      message: "사람이 많아서 안됩니다",
    });
  }
});

io.on("connection", (socket) => {
  console.log(socket.id, "user Connected");
  socket.on("test", (data) => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log(socket.id, "연결끊겼습니다");
  });
  socket.on("dragingTile", (e) => {
    dragTileInfo = { ...dragTileInfo, position: e.position };
    io.emit("dragedTileBroad", e.position);
  });

  socket.on("rotatingDragTile", (e) => {
    dragTileInfo = { ...dragTileInfo, dir: e };
    io.emit("rotatedDragTile", e);
  });
  socket.on("updatingDragTileAfterPushigPosition",(e)=>{
    turnInfo = 3;
    dragTileInfo = { ...dragTileInfo, position: e };
  })
  socket.on("updatingDragTilePosition", (e) => {
    // turnInfo = 3;
    dragTileInfo = { ...dragTileInfo, position: e };
  });
  socket.on("updatePieces", (e) => {
    userInfo = e;
    turnInfo = 3;
    io.emit("updatedPieces",e);
  });
  socket.on("readyPlayers", (nickName) => {
    players[nickName].isReady = !players[nickName].isReady;
    io.emit("readiedPlayers", getPlayerInfo(players));
  });
  socket.on("movingPiece", (pieceData) => {
    way = pieceData.way;
    turnInfo = pieceData.turnInfo;
    movingPiece = pieceData.movingPieceInfo;
    io.emit("movedPiece", pieceData);
  });
  socket.on("gameStart", () => {
    // 게임 시작시켜야 함
    // 누구 차례인지 정해야 하고
    whosTurn = 1;
    turnInfo = 1;
    // 현재 플레이어들의 타겟을 정해줘야하고
    targetRandomizer();
    // 타일 위치도 정해줘야 함
    const result = tileRandomizer();
    userInfo = getPlayerInfo(players);
    // userInfo=userInfo.map((player , idx)=>{
    //   return {...player , targets:[test_target[idx]],coordinate:init_coordinates[idx]}
    // })
    tileInfo = result.tileInfo;
    // 드래그 타일도 정해줘야 함
    dragTileInfo = result.dragTileInfo[0];
    dragTileInfo = { ...dragTileInfo, position: { x: 0, y: 2, z: 0 } };
    io.emit("gameStarted", {});
  });
  // 타일 확정을 누른 직후
  socket.on("tilePushing", (data) => {
    const tmp_dragTileInfo = data.dragTileInfo;
    const tmp_userInfo = data.userInfo;
    const tmp_serverTileInfo = data.serverTileInfo;
    turnInfo = 2;
    dragTileInfo = tmp_dragTileInfo;
    userInfo = tmp_userInfo;
    tileInfo = tmp_serverTileInfo;
    io.emit("tilePushed", data);
  });

  socket.on("sendingChat" , (data)=>{
    chatMassages.unshift(data)
    console.log(data)
    io.emit("sendedChat",chatMassages)
  })

  // 게임말 확정을 누른 직후
  socket.on("confirmingPiece", (data) => {
    // 해야될일
    // 일단 해당 유저의 타겟과 현재 위치의 타겟을 비교
    // 사람 수
    const userCnt = userInfo.length;
    // 현재턴인 사람 가져와
    const now_turn_user_info = userInfo.filter(
      (user) => user.key == whosTurn
    )[0];
    if (
      tileInfo[now_turn_user_info.coordinate].target !== undefined &&
      tileInfo[now_turn_user_info.coordinate].target ===
        now_turn_user_info.targets[0]
    ) {
      // 있다면 타겟제거
      userInfo = userInfo.map((user) => {
        if (user.key === whosTurn) {
          return { ...user, targets: user.targets.slice(1) };
        }
        return user;
      });
      // 제거하고 나머지 타겟이 있는지 없는지 체크
      if (
        userInfo.filter((user) => user.key == whosTurn)[0].targets.length === 0
      ) {
        players={};
        chatMassages=[];
        current_player_num=1;
        // 타겟이 없다면 게임종료 선언
        whosTurn=0;
        const result =  {userInfo : userInfo , complished:true,turnInfo:turnInfo , whosTurn:whosTurn,gameover:true};
        io.emit("confirmedPiece",result)
      }
      else{
        turnInfo=1;
        whosTurn= (((whosTurn-1)+1)%userCnt)+1;
        const result = {userInfo : userInfo , complished:true,turnInfo:turnInfo , whosTurn:whosTurn,gameover:false};
        io.emit("confirmedPiece",result)
      }
    } else {
      turnInfo=1;
      whosTurn= (((whosTurn-1)+1)%userCnt)+1;
      // 그리고 userInfo가 변경됨을 알려야함
      const result = {userInfo : userInfo , complished:false,turnInfo:turnInfo , whosTurn:whosTurn,gameover:false};
      io.emit("confirmedPiece",result)
    }
  });
});

server.listen(3001, function () {
  console.log("3001 started ");
});
