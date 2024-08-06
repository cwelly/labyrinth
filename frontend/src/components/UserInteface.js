import React, { useRef } from "react";

function UserInterface(props) {
  const html = {
    position: 'fixed',
  right: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
    // position: "absolute",
    // top: "20em",
    // right: "20",
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
  }
  return (
    <div style={html}>
      {props.isTileConfirmButton.isVisible && (
        <button style={buttonStyle} onClick={handleActive}>
          {props.isTileConfirmButton.tileDir}
        </button>
      )}
      {/* <ScreenSpace
        depth={10} // Distance from camera
      >
        <Html transform style={{ marginBottom: 50 }} position={[5, 3, 0]}>
          {props.isTileConfirmButton.isVisible && (
            <button style={buttonStyle} onClick={handleActive}>
              {props.isTileConfirmButton.tilePosition.x},
              {props.isTileConfirmButton.tilePosition.z}
            </button>
          )}
        </Html>
      </ScreenSpace> */}
    </div>
  );
  // return  createPortal(
  //   <>
  //     <OrthographicCamera ref={virtualCamera} near={0.0001} far={1} />
  //     <group position-z={-0.1} position-x={0}>
  //       <Html>
  //         I want text here
  //       </Html>
  //       {/* <Plane args={[20, 10, 1]} position-y={0}/>                        */}
  //     </group>
  //   </>,
  //   virtualScene
  // )
}

export default UserInterface;
