import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Camera from "./Camera";
import { ITile } from "./Objects/ITile";
import LandingCanvas from "./LandingCanvas";

function LandingPage(){
    const tileRef = useRef();
    return (<>
    <Form style={{
        position:"fixed",
        top:"15%",
        left:"50%",
        transform:"translateX(-50%)",
        alignItems:"center",
        display:"flex",
        flexDirection:"column",
        zIndex:1000,
        userSelect:"none"
    }}>
         <Form.Label>닉네임</Form.Label>
        <Form.Control type="text" placeholder="닉네임을 입력해주세요" />
        <Form.Text >
          너무 이상한 입력은 다시한번 고려해주세요
        </Form.Text>
        <Button style={{marginTop:"20px"}} variant="primary">로그인</Button>
    </Form>
    <Canvas>
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <LandingCanvas/>
    </Canvas>
    </>);
}

export default LandingPage;