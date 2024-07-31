/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 piece_test.glb --transform 
Files: piece_test.glb [81.58KB] > C:\Users\Hyunho\Documents\업무\수습\labyrinth\frontend\src\assets\piece_test-transformed.glb [5.91KB] (93%)
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function PieceTest(props) {
  const { nodes  } = useGLTF('/piece_test-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder.geometry} material={nodes.Cylinder.material}  scale={[0.5, 1, 0.5]} >
        <meshStandardMaterial attach="material" color={props.color} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/piece_test-transformed.glb')
