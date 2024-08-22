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
let current_player_num = 1;
let whosTurn = 0;
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
function targetRandomizer(){
    const pArray = Object.keys(players);
    const pcnt = pArray.length;
    const nBang = (24/pcnt);
    const arr = shuffleArray(generateAlphabetArray());
    pArray.map( (player , idx)  =>{
        players[player].targets = arr.slice( (idx*nBang), (idx+1)*nBang )
    })
}

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
    if (players[nickname].isActive === false) {
      players[nickname].isActive = true;
      console.log("재 로그인 성공");
      return res
        .status(200)
        .send({
          loginedNickname: nickname,
          success: true,
          message: "다시 어서오세요",
          players: players,
        });
    } else {
      return res
        .status(400)
        .send({
          loginedNickname: nickname,
          success: false,
          message: "이미 접속한 사람이 있습니다",
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
    };
    current_player_num += 1;
    const playerInfo = Object.keys(players).map((key) => {
      return { ...players[key] };
    });
    console.log("로그인 성공", getPlayerInfo(players));
    io.emit("updatePlayers", getPlayerInfo(players));
    return res
      .status(200)
      .send({
        loginedNickname: nickname,
        success: true,
        message: "처음 어서오세요",
        players: players,
      });
  } else {
    return res
      .status(400)
      .send({
        loginedNickname: nickname,
        success: false,
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

  socket.on("readyPlayers", (nickName) => {
    players[nickName].isReady = !players[nickName].isReady;
    io.emit("readiedPlayers", getPlayerInfo(players));
  });
  socket.on("gameStart", () => {
    // 게임 시작시켜야 함
    // 누구 차례인지 정해야 하고
    whosTurn = 1;
    // 현재 플레이어들의 타겟을 정해줘야하고
    targetRandomizer()
    console.log("섞어봤습니다",players)
    // 타일 위치도 정해줘야 함
    // 드래그 타일도 정해줘야 함
    io.emit("gameStarted", {});
  });
});

server.listen(3001, function () {
  console.log("3001 started ");
});
