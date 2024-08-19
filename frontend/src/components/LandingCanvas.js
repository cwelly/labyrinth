import { useFrame } from "@react-three/fiber";
import React ,{useRef}from "react";
import { Vector3 } from "three";
import { ITile } from "./Objects/ITile";
import { LTile } from "./Objects/LTile";
import { OTile } from "./Objects/OTile";

function LandingCanvas(){
    const tileRef = useRef([]);
    const popo = new Vector3(-12,0,0);
    function getRandomInt(n) {
        return Math.floor(Math.random() * (n))+1;
      }
    useFrame((state , delta)=>{
        if(tileRef){
            tileRef.current.map((tile,index)=>{
                tile.getTile().position.x+=delta*2;
                tile.getTile().rotation.y+=delta;
                if(tile.getTile().position.x>15){
                    tile.getTile().position.x=-12-getRandomInt(5);
                }
            })
        }
    })
    // x 는 -왼쪽  +오른쪽
    // y 는 + 위 - 아래
    // z 는 + 가깝게 -멀게 
    return (<>
        <LTile ref={el=>tileRef.current[0]=(el)} rotation={[1,0,0]} scale={[1,0.1,1]} position={new Vector3(-13,3,0)}></LTile>
        <ITile ref={el=>tileRef.current[1]=(el)} rotation={[2,0,0]} scale={[1,0.1,1]} position={new Vector3(-12,0,-5)}></ITile>
        <OTile ref={el=>tileRef.current[2]=(el)} rotation={[+1.5,1,0]} scale={[1,0.1,1]} position={new Vector3(-11,1,-3)}></OTile>
        <OTile ref={el=>tileRef.current[3]=(el)} rotation={[2.5,0,0]} scale={[1,0.1,1]} position={new Vector3(-12,-2,1)}></OTile>
        
        <LTile ref={el=>tileRef.current[4]=(el)} rotation={[-1,0,0]} scale={[1,0.1,1]} position={new Vector3(-14,4,2)}></LTile>
        <LTile ref={el=>tileRef.current[5]=(el)} rotation={[2,0,1]} scale={[1,0.1,1]} position={new Vector3(-19,1,-4)}></LTile>
        <ITile ref={el=>tileRef.current[6]=(el)} rotation={[-2.5,0,1]} scale={[1,0.1,1]} position={new Vector3(-21,-2,-4)}></ITile>
        <OTile ref={el=>tileRef.current[7]=(el)} rotation={[2.5,0,2]} scale={[1,0.1,1]} position={new Vector3(-17,-4,1)}></OTile>

        <LTile ref={el=>tileRef.current[8]=(el)} rotation={[-1,0,3]} scale={[1,0.1,1]} position={new Vector3(-23,3,2)}></LTile>
        <LTile ref={el=>tileRef.current[9]=(el)} rotation={[2,1,1]} scale={[1,0.1,1]} position={new Vector3(-26,-3,-4)}></LTile>
        <ITile ref={el=>tileRef.current[10]=(el)} rotation={[0.5,0,1]} scale={[1,0.1,1]} position={new Vector3(-27,-2,-4)}></ITile>
        <OTile ref={el=>tileRef.current[11]=(el)} rotation={[2,-1,-1]} scale={[1,0.1,1]} position={new Vector3(-30,2,1)}></OTile>
    </>);
}
export default LandingCanvas;