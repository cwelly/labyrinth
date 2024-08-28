import { Canvas } from "@react-three/fiber";
import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import LandingCanvas from "./LandingCanvas";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import "../index.css";
import "../LandingPage.scss";
import { Environment } from "@react-three/drei";

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
    if (show) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000); // Tooltip disappears after 3 seconds

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    } else {
      setShow(false);
    }
  }, [show, setShow]);
  const handleSubmit = async (e) => {
    const nickcname = nickcnameRef?.current.value;
    // 1차적으로 거르기
    if (validateNickname(nickcname)) {
      const result = await login(nickcname);
      if (result.whosTurn !== undefined && result.whosTurn === 0) {
        navigate("/GameRoom", { state: { localAuth: result.localAuth } });
      } else if (result.whosTurn !== undefined && result.whosTurn !== 0) {
        navigate("/Canva", { state: { localAuth: result.localAuth } });
      } else {
        // 로그인 요청 실패
      }
    } else {
      // 닉네임 양식이 맞지 않는 경우
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
          onSubmit={(e) => {
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
          {show && <div id="tooltip1">양식에 맞지 않습니다</div>}
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
      <Canvas style={{ backgroundColor: "#87CEEB" }}>
        <LandingCanvas />
      </Canvas>
    </>
  );
}

export default LandingPage;
