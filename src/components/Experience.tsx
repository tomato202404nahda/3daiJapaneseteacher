"use client";
import {
  CameraControls,
  Environment,
  Gltf,
  Html,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { Teacher } from "./Teacher";
import { degToRad } from "three/src/math/MathUtils.js";
import { Euler } from "three";
import { TypingBox } from "./TypingBox";
import { MessagesList } from "./MessagesList";

export const Experience = () => {
  return (
    <>
      <div className='z-10 md:justify-center fixed bottom-4 left-4 right-4 flex gap-2 flex-wrap justify-stretch'>
        <TypingBox />
      </div>
      <Canvas
        camera={{
          position: [0, 0, 0.0001],
          rotation: { x: 0, y: degToRad(-90), z: 0, order: "XYZ" } as Euler,
        }}
      >
        <CameraManager />
        <Environment preset='sunset' />
        <ambientLight intensity={0.8} color='pink' />
        <Html
          position={[1, 0.8, -6]}
          transform
          scale={2.5}
          distanceFactor={0.5}
        >
          <MessagesList />
        </Html>
        <Teacher
          teacher='Nanami'
          rotation-y={degToRad(30)}
          position={[-1, -1.05, -2.5]}
          scale={1.2}
        />
        <Gltf
          src='/models/classroom1-opt.glb'
          position={[0.5, -1.42069, 1.2]}
          rotation-y={degToRad(-90)}
        />
      </Canvas>
    </>
  );
};

const CameraManager = () => {
  return (
    <CameraControls
      minZoom={1}
      maxZoom={4}
      polarRotateSpeed={-0.3}
      azimuthRotateSpeed={-0.3}
      mouseButtons={{
        left: 1,
        wheel: 16,
        right: 0,
        middle: 0,
      }}
      touches={{
        one: 32,
        two: 512,
        three: 0,
      }}
    />
  );
};
