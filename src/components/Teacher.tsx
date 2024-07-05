import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";

import React from "react";

interface Props extends GroupProps {
  teacher: string;
}

export const teachers = ["Nanami", "Naoki"];
export const Teacher = ({ teacher, ...props }: Props) => {
  const { scene } = useGLTF(`/models/Teacher_${teacher}.glb`);

  return (
    <group {...props}>
      <primitive object={scene}></primitive>
    </group>
  );
};

teachers.forEach((t) => {
  useGLTF.preload(`/models/Teacher_${t}.glb`);
});
