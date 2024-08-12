import React, { useRef, useEffect } from "react";

function UserInterface(props) {
  const {
    turnInfo,
    setTurnInfo,
    handleTileConfirm,
    tileConfirmButton,
    pieceConfirmButton,
    setPieceConfirmButton,
    warningPosition,
    setWarningPosition,
  } = props.state;

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
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    zIndex: "1",
    userSelect: "none" /* Prevent text selection */,
  };
  const buttonStyle = {
    backgroundColor: "#007bff", // 버튼의 배경 색상 (블루)
    color: "#fff", // 텍스트 색상 (흰색)
    border: "none", // 테두리 없음
    borderRadius: "5px", // 모서리 반경
    padding: "10px 20px", // 패딩 (위아래 10px, 좌우 20px)
    fontSize: "16px", // 글자 크기
    cursor: "pointer", // 포인터 커서
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // 그림자
    transition: "background-color 0.3s, transform 0.2s", // 부드러운 전환 효과
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
  }, [warningPosition]);

  function handleTileConfirmButton() {
    alert("clicked");
    handleTileConfirm(false);
    // 차례 정보를 바꿔버려
    setTurnInfo(2);
    props.handleTilePush();
  }
  function handlePieceConfirmButton() {
    props.handlePieceConfirm();
  }
  return (
    <div style={html}>
      {tileConfirmButton && (
        <button style={buttonStyle} onClick={handleTileConfirmButton}>
          타일 확정?!
        </button>
      )}
      {pieceConfirmButton && (
        <button style={buttonStyle} onClick={handlePieceConfirmButton}>
          게임말 위치 확정?!
        </button>
      )}
      {warningPosition&&<div style={toolTip}>이어지지 않은 장소입니다!</div>}
    </div>
  );
}

export default UserInterface;
