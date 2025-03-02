import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

export default function CameraTransition() {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(0, 0, 2)
  );
  const isTransitioningRef = useRef(false);
  const [isEntryScene, setIsEntryScene] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 5);
    }
  });

  const handleTransition = () => {
    if (!isTransitioningRef.current) {
      isTransitioningRef.current = true;

      if (isEntryScene) {
        setIsEntryScene(false);
        // Ajuster la position pour les appareils mobiles
        const newPosition = isMobile
          ? new THREE.Vector3(0, 0, 3) // Position plus éloignée pour mobile
          : new THREE.Vector3(0, 0, 2);
        setTargetPosition(newPosition);
      } else {
        setIsEntryScene(true);
        // Ajuster la position initiale pour les appareils mobiles
        const newPosition = isMobile
          ? new THREE.Vector3(0, 8, -15) // Position adaptée pour mobile
          : new THREE.Vector3(0, 10, -20);
        setTargetPosition(newPosition);
      }
    }
  };

  useEffect(() => {
    // Gestion du clavier pour desktop
    const handleSpacebar = (event: KeyboardEvent) => {
      if (event.key === " " && !event.repeat) {
        handleTransition();
      }
    };

    // Gestion des événements tactiles pour mobile
    const handleTouch = (event: TouchEvent) => {
      event.preventDefault();
      handleTransition();
    };

    window.addEventListener("keydown", handleSpacebar);
    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("keydown", handleSpacebar);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [isEntryScene, isMobile]);

  useFrame((_, delta) => {
    if (cameraRef.current && isTransitioningRef.current) {
      // Ajuster la vitesse de transition pour mobile
      const transitionSpeed = isMobile ? 2.0 : 1.5;
      cameraRef.current.position.lerp(targetPosition, delta * transitionSpeed);

      // Arrêter la transition lorsqu'on atteint la cible
      if (cameraRef.current.position.distanceTo(targetPosition) < 0.1) {
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={isMobile ? [0, 8, -15] : [0, 10, -20]}
      fov={isMobile ? 85 : 75}
    />
  );
}
