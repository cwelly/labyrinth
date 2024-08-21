const express = require('express');
const http = require('http')
// const { Server } = require('socket.io');

const app= express();
//cors 설정
var cors = require("cors")
app.use(cors());
app.use(express.json({ extended: true }));
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
// 플레이어 정보 관리 변수
let players = {};
let color = ["red","blue","yellow","green"]
let current_player_num=1;

app.get('/players', (req,res)=>{
    const playerInfo = Object.keys(players).map(key=>{
        return {...players[key]}
    })
    return res.status(200).send({success:true , message : "처음 화면이네요" , players:playerInfo})
})
app.post( '/login' , (req,res)=>{
    const {nickname} = req.body;
    console.log(nickname)
    // 이미 있는 경우 (이 뒤에 현재 세션에 몇명인지 체크하는 방식으로 넘어가야함)
    if(nickname in players){
        // 재접속하는 경우
        return res.status(200).send({loginedNickname:nickname,success:true , message : "다시 어서오세요", players:players})
    }
    // 없는 경우
    else if ( !(nickname in players)&& Object.keys(players).length<4 ){
        // 추가로 들어온 경우
        players[nickname]={key:current_player_num ,color:color[current_player_num-1] , nickName:nickname,isReady:false}
        current_player_num+=1;
        const playerInfo = Object.keys(players).map(key=>{
            return {...players[key]}
        })
        console.log(playerInfo);
        io.emit('updatePlayers', playerInfo);
        return res.status(200).send({loginedNickname:nickname,success:true , message : "처음 어서오세요" , players:players})
    }
    else{
        return res.status(400).send({loginedNickname:nickname,success:false , message : "사람이 많아서 안됩니다"})
    }
});

// io.on('GameroomPlayers' , (socket)=>{

// });


server.listen( 3001, function(){
    console.log('3001 started ')
} );