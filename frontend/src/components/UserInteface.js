import React, { useRef } from "react";

function UserInterface(props) {
  const {turnInfo ,setTurnInfo,handleTileConfirm,tileConfirmButton} = props.state
  const html = {
    position: 'fixed',
  right: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
    zIndex: "1",
  };
  const buttonStyle = {
    backgroundColor: '#007bff', // 버튼의 배경 색상 (블루)
    color: '#fff', // 텍스트 색상 (흰색)
    border: 'none', // 테두리 없음
    borderRadius: '5px', // 모서리 반경
    padding: '10px 20px', // 패딩 (위아래 10px, 좌우 20px)
    fontSize: '16px', // 글자 크기
    cursor: 'pointer', // 포인터 커서
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // 그림자
    transition: 'background-color 0.3s, transform 0.2s', // 부드러운 전환 효과
  };
  function handleActive() {
    alert("clicked");
    handleTileConfirm(false)
    // 차례 정보를 바꿔버려
    setTurnInfo(2);
    props.handleTilePush();
  }
  return (
    <div style={html}>
      {tileConfirmButton && (
        <button style={buttonStyle} onClick={handleActive}>
          타일 확정?!
        </button>
      )}
    </div>
  );
}

export default UserInterface;
