import { useEffect, useRef, useState } from "react";
import {
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";

export default function EntryScene() {
  const textRef = useRef<THREE.Mesh>(null);
  const textSubRef = useRef<THREE.Mesh>(null);

  const [matcapTexture] = useMatcapTexture("495CA6_CCD2E6_A5B1D8_1E2852");

  const textSettings = useControls("text", {
    position: {
      value: [0, 8, 0],
      step: 0.01,
    },
    scale: {
      value: 2,
      step: 0.1,
    },
    rototationY: {
      value: 1,
      step: 0.01,
    },
    rotationX: {
      value: 0,
      step: 0.01,
    },
  });

  const [textWidth, setTextWidth] = useState<number>(0);
  const [textSubWidth, setTextSubWidth] = useState<number>(0);

  useEffect(() => {
    if (textRef.current) {
      // Calculer la largeur du texte
      const boundingBox = new THREE.Box3().setFromObject(textRef.current);
      const width = boundingBox.max.x - boundingBox.min.x;
      setTextWidth(width);
    }

    if(textSubRef.current) {
      // Calculer la largeur du texte
      const boundingBox = new THREE.Box3().setFromObject(textSubRef.current);
      const width = boundingBox.max.x - boundingBox.min.x;
      setTextSubWidth(width);
    }
  }, [textSettings]);



  return (
    <>
      <group rotation-y={Math.PI * textSettings.rototationY} rotation-x={Math.PI * textSettings.rotationX}>
          {/* Texte principal */}
          <Text3D
            ref={textRef}
            font="./fonts/helvetiker_regular.typeface.json"
            position={[-textWidth / 2, textSettings.position[1], textSettings.position[2]]} // Position ajustée
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            scale={1.5}
          >
            <meshMatcapMaterial matcap={matcapTexture} />
            Portfolio - @Jqn.art
          </Text3D>
          {/* Texte secondaire */}
          <Text3D
            ref={textSubRef}
            font="./fonts/helvetiker_regular.typeface.json"
            position={[-textSubWidth / 2, textSettings.position[1] - 2 , textSettings.position[2]]} // Ajuster Y pour décaler le texte secondaire
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            scale={0.8}
          >
            <meshMatcapMaterial matcap={matcapTexture} />
            Press Space
          </Text3D>
      </group>
    </>
  );
}
