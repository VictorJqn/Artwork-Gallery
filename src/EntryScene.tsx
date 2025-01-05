import { useRef } from "react";
import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EntryScene() {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (textRef.current) {
      // Faire pointer le texte vers la caméra
      textRef.current.lookAt(new THREE.Vector3(-10, 15, -20 ));
    }
  });

  return (
    <>
        <Text3D
          ref={textRef} // Attacher la référence
          font="./fonts/helvetiker_regular.typeface.json"
          position={[0.25 , 3.3 , -5 ]} // Positionner le texte
        >
          <meshBasicMaterial color="white"  />
          Portfolio - Jqn.art
        </Text3D>
    </>
  );
}
