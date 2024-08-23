import React, {  useEffect, useState } from "react";
import "../index.css";
import "../UserInterface.scss";
import { 
  Button, 
  Table,
  ListGroup,
  Image,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
function UserInterface(props) {
  const { 
    setTurnInfo,
    handleTileConfirm,
    tileConfirmButton,
    pieceConfirmButton, 
    warningPosition,
    setWarningPosition,
    userInfo, 
    whosTurn, 
    myPieceInfo, 
  } = props.state;
  const [chatVisible, setChatVisible] = useState(true);
  const toolTip = {
    width: "200px",
    backgroundColor: "#555",
    color: "#fff",
    textAlign: "center",
    borderRadius: "5px",
    padding: "5px 0",
    position: "absolute",
    zIndex: 1,
    bottom: "125%" /* Position above the trigger element */,
    left: "50%",
    marginLeft: "-100px" /* Center the tooltip */,
    opacity: 1,
    transition: "opacity 0.3s",
  };

  const html = {
    position: "fixed",
    right: "20px",
    top: "50%",
    fontFamily: "notoExtraBold",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    zIndex: "1",
    userSelect: "none" /* Prevent text selection */,
  };

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
  }, [warningPosition,setWarningPosition]);
  // console.log(turnInfo,'턴인포',myPieceInfo,'마턴인포',whosTurn,'후이즈인포')
  function handleTileConfirmButton() {
    // alert("clicked");
    // 테스트용 주석처리 , 다하면 이두개 바꿀것
    // handleTileConfirm(false);
    // setTurnInfo(2);
    props.handleTilePush();
  }
  function handlePieceConfirmButton() {
    props.handlePieceConfirm();
  }
  // console.log(tileConfirmButton,"타일 확정 버튼" , pieceConfirmButton,"게임말 확정 버튼")
  return (
    <>
      <Table id="current-score" bordered>
        <thead className="table-head">
          <tr>
            <td colSpan={4}>남은 목표수</td>
          </tr>
        </thead>
        {userInfo !== undefined ? (
          <tbody>
            <tr className="table-body-name">
              {userInfo?.map((user) => {
                return (
                  <td key={user?.key} style={{ color: user?.color }}>
                    {user?.nickName}
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
        )
        }
      </Table>
      {whosTurn === myPieceInfo.key && (
        <Button
          style={{
            fontFamily: "Noto Sans KR, sans-serif",
            position: "fixed",
            bottom: "0",
            right: "0",
            width: "300px",
            margin: "10px",
            zIndex: 1000,
          }}
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
      )}
      <div style={html}>
        {warningPosition && <div style={toolTip}>불가능한 장소입니다!</div>}
      </div>
      <div id="player-list">
        <ListGroup>
          <ListGroupItem variant="dark">
            <Image id="player-list-icon" src="list.png" />
          </ListGroupItem>
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
                  {whosTurn === user.key && <>✔</>}
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
      <div id="current-target">
        <ListGroup>
          <ListGroupItem>현재 목표</ListGroupItem>
          {myPieceInfo.targets !== undefined ? (
            <ListGroupItem>{myPieceInfo?.targets[0]}</ListGroupItem>
          ) : (
            <div>Loading...</div>
          )}
        </ListGroup>
      </div>
    </>
  );
}


export default UserInterface;
