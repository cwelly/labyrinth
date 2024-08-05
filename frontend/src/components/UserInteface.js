import { Fullscreen, Root, Text, Container } from "@react-three/uikit";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from 'three';
import React, { useRef } from "react";
import { Leva, useControls } from 'leva';
function UserInterface(props) {
  // console.log(props.isTileConfirmButton.tilePosition)
  const { buttonClicked } = useControls(() => ({
    buttonClicked: {
      value: false,
      label: 'Click Me',
      onChange: (value) => {
        console.log('Button clicked:', value);
        // 버튼 클릭 시 행동을 여기에 추가
      },
    },
  }));
  function handleActive() {
    console.log("clicked");
  }
  return (
    <>
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => {
          // 버튼 클릭 시의 로직
          console.log('Button clicked');
        }}
      >
        Click Me
      </button>
    </div>
      {
        // <Fullscreen
        // flexDirection="column"
        //   justifyContent="flex-start"
        //   alignItems="flex-end"
        // //   paddingTop={32}
        // //   paddingRight={32}
        // //
        // >
        //      {props.isTileConfirmButton.isVisible &&
        //      <Container flexGrow={1} hover={{ backgroundColor: "red" }}  >
        //         <Text>haha</Text>
        //         </Container>}
        //   <Text backgroundColor="black"    color="white"> {props.isTileConfirmButton.tilePosition.x}</Text>
        // </Fullscreen>
      }
    </>
  );
}

export default UserInterface;
