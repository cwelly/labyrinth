import React, { useEffect, useState, useRef } from "react";
import "../index.css";
import "../UserInterface.scss";
import {
  Button,
  Table,
  ListGroup,
  Image,
  ListGroupItem,
  Spinner,
  Offcanvas,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function UserInterface(props) {
  const {
    handleTileConfirm,
    tileConfirmButton,
    pieceConfirmButton,
    warningPosition,
    setWarningPosition,
    userInfo,
    whosTurn,
    myPieceInfo,
    socket,
    gameResult,
    chatMassages,
    setChatMassages,
  } = props.state;
  const [chatVisible, setChatVisible] = useState(true);
  // 테스트용
  const [show, setShow] = useState(true);

  const navigate = useNavigate();
  const chatRef = useRef();


  

  // 채팅 관련 useEffect
  useEffect(() => {
    socket.on("sendedChat", (data) => {
      setChatMassages(data);
      console.log(data);
    });
    return () => {
      socket.off("sendedChat");
    };
  }, [setChatMassages,socket]);
  useEffect(() => {
    if (warningPosition) {
      setWarningPosition(true);
      const timer = setTimeout(() => {
        setWarningPosition(false);
      }, 3000); // Tooltip disappears after 3 seconds

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    } else {
      setWarningPosition(false);
    }
  }, [warningPosition, setWarningPosition]);
  const resetTextInput = () => {
    chatRef.current.value = null;
  };
  function handleTileConfirmButton() {
    props.handleTilePush();
    handleTileConfirm(false);
  }
  function handlePieceConfirmButton() {
    props.handlePieceConfirm();
  }
  // console.log(tileConfirmButton,"타일 확정 버튼" , pieceConfirmButton,"게임말 확정 버튼")
  return (
    <>
      {gameResult === true && (
        <div id="winner-Info">
          <Offcanvas
            id="winner"
            show={show}
            onHide={() => {
              setShow(false);
            }}
            name="test"
            placement="top"
            scroll="false"
            backdrop="false"
          >
            <h1>
              {userInfo.filter((user) => user.targets.length === 0)[0]?.nickName}
              님의 승리!
            </h1>
            <Button
              onClick={() => {
                navigate('/');
              }}
            >
              HOME
            </Button>
            <Table bordered id="winner-table">
              <thead>
                <tr>
                  <td colSpan={userInfo.length}>남은 목표 수</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {userInfo.map((user) => {
                    return <td key={user.key}>{user.nickName}</td>;
                  })}
                </tr>
                <tr>
                  {userInfo.map((user) => {
                    return <td key={user.key}>{user.targets.length}</td>;
                  })}
                </tr>
              </tbody>
            </Table>
            <Offcanvas.Body></Offcanvas.Body>
          </Offcanvas>
        </div>
      )}

      <Table id="current-score" bordered>
        <thead className="table-head">
          <tr>
            <td colSpan={userInfo.length}>남은 목표수</td>
          </tr>
        </thead>
        {userInfo !== undefined ? (
          <tbody>
            <tr className="table-body-name">
              {userInfo?.map((user) => {
                return (
                  <td key={user?.key} style={{ color: user?.color }}>
                    {(myPieceInfo&&user.key===myPieceInfo.key)&&<Badge bg="success">me
                      </Badge>}{user?.nickName}
                  </td>
                );
              })}
            </tr>
            <tr className="table-body-content">
              {userInfo?.map((user) => {
                return <td key={user?.key}>{user?.targets.length}</td>;
              })}
            </tr>
          </tbody>
        ) : (
          <Spinner animation="border" role="status" />
        )}
      </Table>
      {myPieceInfo&&whosTurn === myPieceInfo.key && (
        <div id="infos" >
          
          <Button
            id="confirm-button"
            size="lg"
            variant="warning"
            disabled={!tileConfirmButton && !pieceConfirmButton}
            onClick={
              tileConfirmButton
                ? handleTileConfirmButton
                : handlePieceConfirmButton
            }
          >
            위치 확정
          </Button>
          {warningPosition && <div id="tooltip" className="tooltip">불가능한 장소입니다!</div>}
        </div>
      )}
      <div id="player-list">
        <ListGroup>
          {/* <ListGroupItem variant="dark">
            <Image id="player-list-icon" src="list.png" />
          </ListGroupItem> */}
          <ListGroupItem variant="dark">참가자</ListGroupItem>
          {userInfo !== undefined ? (
            userInfo.map((user) => {
              let theme = "";
              if (user.color === "red") theme = "danger";
              else if (user.color === "blue") theme = "primary";
              else if (user.color === "green") theme = "success";
              else if (user.color === "yellow") theme = "warning";
              return (
                <ListGroupItem
                  key={user.key}
                  style={{ color: user.color }}
                  variant={whosTurn === user.key ? theme : "dark"}
                >
                  {whosTurn === user.key && <> 차례<br/></>}
                  {user.nickName}
                </ListGroupItem>
              );
            })
          ) : (
            <div>Loading...</div>
          )}
        </ListGroup>
      </div>

      {/* <Chatroom chatVisible={chatVisible} setChatVisible={setChatVisible}></Chatroom> */}
      {myPieceInfo&&(chatVisible ? (
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
              if (mes.key === myPieceInfo.key) {
                return (
                  <div key={idx} className={"message-my-" + myPieceInfo.color}>
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
                  nickName: myPieceInfo.nickName,
                  key: myPieceInfo.key,
                  time: hour + ":" + minutes,
                  color: myPieceInfo.color,
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
      {myPieceInfo&&<div id="current-target">
        <ListGroup>
          <ListGroupItem>현재 목표</ListGroupItem>
          {myPieceInfo.targets !== undefined ? (
            <ListGroupItem>{myPieceInfo?.targets[0]}</ListGroupItem>
          ) : (
            <div>Loading...</div>
          )}
        </ListGroup>
      </div>}
      
    </>
  );
}

export default UserInterface;
