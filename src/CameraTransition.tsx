import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

export default function CameraTransition() {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(0, 0, 2));
  const isTransitioningRef = useRef(false);
  const [isEntryScene, setIsEntryScene] = useState(true);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 5); // Orienter la caméra vers [0, 0, 5]
    }
  });

  useEffect(() => {
    const handleSpacebar = (event: KeyboardEvent) => {
      if (event.key === " " ) {
        isTransitioningRef.current = true;

        if (isEntryScene) {
          setIsEntryScene(false);
          setTargetPosition(new THREE.Vector3(0, 0, 2));
          cameraRef.current?.lookAt(0, 0, 5);
        } else {
          setIsEntryScene(true);
          setTargetPosition(new THREE.Vector3(-10, 10, -10));
        }
      }
    };

    window.addEventListener("keydown", handleSpacebar);

    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [isEntryScene]);

  useFrame(() => {
    if (cameraRef.current && isTransitioningRef.current) {
      // Transition de position
      cameraRef.current.position.lerp(targetPosition, 0.01        );

      // Arrêter la transition lorsqu'on atteint la cible
      if (cameraRef.current.position.distanceTo(targetPosition) < 0.1) {
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <>
      {/* Ajouter une caméra de trois */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault // Remplace la caméra par défaut du Canvas
        position={[-10, 10, -10]} // Position initiale
        fov={75} // Champ de vision
      />
      
    </>
  );
}
