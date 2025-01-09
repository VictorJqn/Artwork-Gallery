import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { PointLight } from "three";
import * as THREE from "three";

export function Cloud() {
  const flash = useRef<PointLight | null>(null);
  const ambientFlash = useRef<THREE.AmbientLight | null>(null);
  console.log(Math.random())

  useFrame(() => {
    if (flash.current) {
      if ((Math.random() > 0.99) || flash.current.intensity > 0) {
          if (flash.current.intensity < 100) {
            flash.current.intensity += Math.random() * 5;
          } else {
            flash.current.intensity = 0;
          }
        

        if (ambientFlash.current) {
          ambientFlash.current.intensity = 0.5;
        }
      } else {
        flash.current.intensity = Math.max(0, flash.current.intensity - 10);
        if (ambientFlash.current) {
          ambientFlash.current.intensity = Math.max(
            0,
            ambientFlash.current.intensity - 0.05
          );
        }
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientFlash} intensity={0} />
      <pointLight
        position={[0, 500, 0]}
        color={"#062d89"}
        intensity={0}
        distance={1000}
        decay={1.7}
        ref={flash}
      />
    </>
  );
}
