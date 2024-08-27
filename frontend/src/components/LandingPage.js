import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import LandingCanvas from "./LandingCanvas";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import "../index.css";
import "../LandingPage.scss";

function LandingPage() {
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);
  const nickcnameRef = useRef();
  const [show, setShow] = useState("");
  
  function validateNickname(nickcname) {
    const isValidLength = nickcname.length >= 4 && nickcname.length <= 10;
    // 특수문자 확인
    const isValidCharacters = /^[a-zA-Z가-힣0-9]+$/.test(nickcname); 
    return isValidCharacters && isValidLength;
  }
  useEffect(() => {
    const path = localStorage.getItem("navigateTo");
    if (null!==path) {
      navigate(path);
      localStorage.removeItem("navigateTo"); // 경로 정보 제거
    }
  }, [navigate]);
  const handleSubmit = (e) => { 
    const nickcname = nickcnameRef?.current.value;
    // 1차적으로 거르기
    if (validateNickname(nickcname)) {
      login(nickcname);
      navigate("/GameRoom");
    } else { 
      setShow(true);
    }
  };

  return (
    <>
      <div>
        <Form
          id="login-form"
          style={{
            position: "fixed",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            userSelect: "none",
          }}
          onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit(e);
        }}
        >
            <h1 id="logo">라비린스</h1>
          <Form.Label id="title">닉네임</Form.Label>
          <Form.Control
            ref={nickcnameRef}
            type="text"
            placeholder="사용할 닉네임을 입력해주세요"
          />
          <Form.Text>4~10 길이의 영어 , 숫자 , 한글을 입력해주세요 </Form.Text>
          <Button
            id="submit-button"
            variant="primary"
            size="lg"
            onClick={handleSubmit}
          >
            로그인
          </Button>
        </Form>
      </div>
      <Canvas style={{ backgroundColor: '#87CEEB' }}>
        <LandingCanvas />
      </Canvas>
    </>
  );
}

export default LandingPage;
