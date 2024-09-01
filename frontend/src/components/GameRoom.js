import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./LoginContext";
import {
  Button,
  Table,
  ListGroup,
  Image,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
import "../GameRoom.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import GameRoomCanvas from "./GameRoomCanvas";
import {
  CameraControls,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  View,
} from "@react-three/drei";
import { PieceTest } from "./Objects/PieceTest";

function GameRoom({ socket, netAddress }) {
  const [chatVisible, setChatVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [myInfo, setMyInfo] = useState({});
  const navigate = useNavigate();
  const { loginedNickname } = useAuth();
  const [userInfo, setUserInfo] = useState([]);
  const chatRef = useRef();
  const [emptyArr, setEmptyArr] = useState([1, 2, 3, 4]);
  const [chatMassages, setChatMassages] = useState([]);
  useEffect(() => {
    socket.on("sendedChat", (data) => {
      setChatMassages(data);
      console.log(data);
    });
    return () => {
      socket.off("sendedChat");
    };
  }, [socket]);
  const resetTextInput = () => {
    chatRef.current.value = null;
  };
  useEffect(() => {
    console.log(
      "닉네임 ; ",
      localStorage.getItem("nickname"),
      myInfo,
      loginedNickname
    );
  }, []);
  useEffect(() => {
    setMyInfo(userInfo.filter((player) => player.nickName === loginedNickname));
    if (userInfo.length === 1) {
      setEmptyArr([1, 2, 3]);
    } else if (userInfo.length === 2) {
      setEmptyArr([1, 2]);
    } else if (userInfo.length === 3) {
      setEmptyArr([1]);
    } else {
      setEmptyArr([]);
    }
  }, [userInfo, loginedNickname]);
  // 처음 들어올때 유저정보를 초기화하는 부분
  useEffect(() => {
    axios
      .get("http://" + netAddress + ":3001/players")
      .then((res) => {
        setUserInfo(res.data.players);
        setMyInfo(
          res.data.players.filter(
            (player) => player.nickName === loginedNickname
          )
        );
      })
      .catch(() => { });
  }, [loginedNickname]);

  // 유저정보가 바뀔때마다 반응하도록 하는 effect
  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      setUserInfo(players);
    });
    socket.on("readiedPlayers", (players) => {
      setUserInfo(players);
    });
    socket.on("gameStarted", () => {
      navigate("/Canva");
    });
    return () => {
      socket.off("readiedPlayers");
      socket.off("updatePlayers");
    };
  }, [socket, navigate]);
  // console.log(myInfo,"내정보")
  return (
    <>
      {
        // 게임준비완료버튼을 생성하는 조건
        myInfo.length !== 0 &&
        userInfo?.length > 1 &&
        userInfo.filter((user) => user.isReady === true).length ===
        userInfo.length &&
        myInfo[0].key === 1 && (
          <div>
            <Button
              id="start-button"
              variant="warning"
              onClick={() => {
                socket.emit("gameStart", {});
              }}
            >
              게임시작
            </Button>
          </div>
        )
      }
      <div id="ready">
        {userInfo !== undefined ? (
          <>
            {
              userInfo?.map((user) => {
                return (
                  <div className="ready-space" key={user.key}> 
                    <div className="ready-space-nickName">{user.nickName}</div>
                    <View className="ready-space-view" index={3} frames={1} >
                      {user.isReady?(<color attach="background" args={["grey"]} />):(<color attach="background" args={["white"]} />)}
                      <PieceTest
                        position={[0, 0, 0]}
                        sclae={[0.2, 0.2, 0.2]}
                        color={user.color} ></PieceTest>

                      <ambientLight intensity={0.9} />
                      <directionalLight position={[10, 10, 10]} intensity={1} />
                      <PerspectiveCamera makeDefault fov={60} position={[0, 1, 5]} />
                    </View>
                    {user.isReady&&<div className="ready-space-isRedied">ready</div>}
                  </div>
                );
              })
            }
            {
              (emptyArr.map((cc, idx) => {
                return (
                  <div className="ready-space" key={idx}></div>
                );
              }))
            }
          </>
        ) : (
          <Spinner animation="border" role="status" />
        )}


      </div>
      <Canvas
        eventSource={document.getElementById("root")}
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
          // background:"#87CEEB",
          zIndex: "-1",
        }}
      >
        {/* <GameRoomCanvas></GameRoomCanvas> */}
        <View.Port></View.Port>
      </Canvas>
      {myInfo.length !== 0 && (
        <div>
          <Button
            id="ready-button"
            variant={ready ? "primary" : "secondary"}
            onClick={() => {
              setReady(!ready);
              // 값들 바꿀 부분
              // 송신할 부분
              const newUserInfo = userInfo.map((user) => {
                if (user.nickName === loginedNickname) {
                  return { ...user, isReady: !user.isReady };
                }
                return user;
              });
              socket.emit("readyPlayers", loginedNickname);
              setUserInfo(newUserInfo);
            }}
          >
            준비 완료
          </Button>
        </div>
      )}
      <View style={{width:"100%" ,height:"100%"}}>
      <color attach="background" args={["#87CEEB"]} />
        <GameRoomCanvas></GameRoomCanvas>
      </View>
      {/* <div id="ready">
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
                {emptyArr.map((cc, idx) => {
                  return (
                    <td key={idx} className="ready-space-not-readied"></td>
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
                {emptyArr.map((cc, idx) => {
                  return <td key={idx}></td>;
                })}
              </tr>
            </tbody>
          ) : (
            <Spinner animation="border" role="status" />
          )}
        </Table>
      </div> */}
      <div id="game-player-list">
        <ListGroup>
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
      {myInfo.length !== 0 &&
        (chatVisible ? (
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
            <div className="messages-list">
              {chatMassages.map((mes, idx) => {
                if (mes.key === myInfo[0].key) {
                  return (
                    <div key={idx} className={"message-my-" + myInfo[0].color}>
                      <p1 className="time">{mes.time}</p1>
                      <hgroup className="speech-bubble">
                        <h4>{mes.massage}</h4>
                      </hgroup>
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className={"message-another-" + mes.color}>
                      <hgroup className="speech-bubble">
                        <h4>{mes.massage}</h4>
                      </hgroup>
                      <div>
                        <p1 className="another-name">{mes.nickName}</p1>
                        <p1 className="time">{mes.time}</p1>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            <form
              className="message-form"
              onSubmit={(e) => {
                e.preventDefault();
                const now = new Date();
                const minutes = now.getMinutes().toString().padStart(2, "0");
                const hour = now.getHours().toString().padStart(2, "0");
                // console.log(now.getHours)
                if (chatRef.current.value.length > 0) {
                  socket.emit("sendingChat", {
                    massage: chatRef?.current.value,
                    nickName: myInfo[0].nickName,
                    key: myInfo[0].key,
                    time: hour + ":" + minutes,
                    color: myInfo[0].color,
                  });
                  resetTextInput();
                }
              }}
            >
              <input type="text" className="message-input" ref={chatRef} />
              <button className="send-button">send</button>
            </form>
          </div>
        ))}
    </>
  );
}

export default GameRoom;
