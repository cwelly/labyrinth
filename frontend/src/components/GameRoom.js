import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginContext";
import {
  Button,
  Table,
  ListGroup,
  Image,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
import io from "socket.io-client";
import "../GameRoom.scss";
import axios from "axios";
let server_player_info = [
  { nickName: "susie", color: "red", key: 1, isReady: true },
  { nickName: "sam123", color: "green", key: 3, isReady: false },
];
const socket = io("http://localhost:3001", 
  {transports: ['websocket', 'polling']});

function GameRoom() {
  const cc = useContext(LoginContext);
  const [chatVisible, setChatVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const { loginedNickname } = cc;
  const [userInfo, setUserInfo] = useState([]);
  // 이 페이지에서 벗어날때 처리하는 effect
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 유저 상태를 "inactive"로 변경
      // setUser((prevUser) => ({
      //   ...prevUser,
      //   status: 'inactive',
      // }));
    };

    const handlePopState = () => {
      // 뒤로가기를 할 때 유저 상태를 "inactive"로 변경
      // setUser((prevUser) => ({
      //   ...prevUser,
      //   status: 'inactive',
      // }));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  useEffect( ()=>{
    axios.get('http://localhost:3001/players')
    .then(res=>{ setUserInfo(res.data.players)})
    .catch(error=>{});
  } , [] );
  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      setUserInfo(players);
    });
    return () => {
      socket.off("updatePlayers");
    };
  }, []);
  // console.log(userInfo)
  return (
    <>
      <div>
        <Button
          id="ready-button"
          variant={ready ? "primary" : "outline-primary"}
          onClick={(e) => {
            setReady(!ready);
            // 값들 바꿀 부분
            console.log(loginedNickname);
            // 송신할 부분
            const newUserInfo = userInfo.map((user) => {
              if (user.nickName === loginedNickname) {
                return { ...user, isReady: !user.isReady };
              }
              return user;
            });
            socket.emit("updatePlayers",()=>{})
            setUserInfo(newUserInfo);
          }}
        >
          준비 완료
        </Button>
      </div>
      <div id="ready">
        <Table id="ready-table" bordered>
          {userInfo !== undefined ? (
            <tbody>
              <tr>
                {userInfo?.map((user) => {
                  return (
                    <td
                      className={
                        user.isReady
                          ? "ready-space-readied"
                          : "ready-space-not-readied"
                      }
                      key={user.key}
                    ></td>
                  );
                })}
              </tr>
              <tr>
                {userInfo?.map((user) => {
                  return (
                    <td key={user.key} style={{ color: user.color }}>
                      {user.nickName}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          ) : (
            <Spinner animation="border" role="status" />
          )}
        </Table>
      </div>
      <div id="game-player-list">
        <ListGroup>
          <ListGroupItem variant="light">
            <Image id="player-list-icon" src="list.png" />
          </ListGroupItem>
          <ListGroupItem variant="light">참가자</ListGroupItem>
          {userInfo !== undefined ? (
            userInfo.map((user) => {
              return (
                <ListGroupItem
                  key={user.key}
                  style={{ color: user.color }}
                  variant={"light"}
                >
                  {user.nickName}
                </ListGroupItem>
              );
            })
          ) : (
            <div>Loading...</div>
          )}
        </ListGroup>
      </div>
      {chatVisible ? (
        <div id="chatroom-small" onClick={() => setChatVisible(!chatVisible)}>
          <Image id="player-list-icon" src="list.png" /> 대화하기
        </div>
      ) : (
        <div id="chatroom-big">
          <Image
            id="chatroom-icon"
            src="minimize_img.png"
            onClick={() => setChatVisible(!chatVisible)}
          />
          <div className="messages-list"></div>
          <form
            className="message-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input type="text" className="message-input" />
            <button className="send-button">send</button>
          </form>
        </div>
      )}
    </>
  );
}

export default GameRoom;