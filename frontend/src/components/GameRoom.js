import React, { useContext, useState } from "react";
import { LoginContext } from "./LoginContext";
import {
  Card,
  Button,
  Form,
  InputGroup,
  FormControl,
  Table,
  ListGroup,
  Image,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
import "../GameRoom.scss";
let server_player_info = [
  { nickName: "susie", color: "red", key: 1, isReady: true },
  { nickName: "sam123", color: "green", key: 3, isReady: false },
];
function GameRoom() {
  const cc = useContext(LoginContext);
  const [chatVisible, setChatVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const { loginedNickname } = cc;
  const [userInfo, setUserInfo] = useState(server_player_info);
  return (
    <>
      <div>
        <Button
          id="ready-button"
          variant={ready ? "primary" : "outline-primary"}
          onClick={(e) => {
            setReady(!ready);
            // 값들 바꿀 부분

            // 송신할 부분
            const newUserInfo = userInfo.map(user => {
              if(user.nickName===loginedNickname.nickname){
                return {...user , isReady:!user.isReady}
              }
              return user;
            })
            setUserInfo(newUserInfo)
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
