import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface CameraTransitionProps {
  onTransitionStart?: () => void;
}

export interface CameraTransitionHandle {
  handleTransition: () => void;
}

const CameraTransition = forwardRef<
  CameraTransitionHandle,
  CameraTransitionProps
>(({ onTransitionStart }, ref) => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(0, 0, 2)
  );
  const isTransitioningRef = useRef(false);
  const [isEntryScene, setIsEntryScene] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const mounted = useRef(true);

  useImperativeHandle(ref, () => ({
    handleTransition: () => {
      if (!isTransitioningRef.current && mounted.current) {
        isTransitioningRef.current = true;

        if (onTransitionStart) {
          try {
            onTransitionStart();
          } catch (error) {
            console.error("Erreur lors du démarrage de la transition:", error);
          }
        }

        if (isEntryScene) {
          setIsEntryScene(false);
          const newPosition = isMobile
            ? new THREE.Vector3(0, 0, 1)
            : new THREE.Vector3(0, 0, 2);
          setTargetPosition(newPosition);
        } else {
          setIsEntryScene(true);
          const newPosition = isMobile
            ? new THREE.Vector3(0, 10, -25)
            : new THREE.Vector3(0, 10, -20);
          setTargetPosition(newPosition);
        }
      }
    },
  }));

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkMobile = () => {
      if (mounted.current) {
        setIsMobile(window.innerWidth <= 768);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useFrame(() => {
    if (cameraRef.current && mounted.current) {
      cameraRef.current.lookAt(0, 0, 5);
    }
  });

  useEffect(() => {
    if (!isMobile && mounted.current) {
      const handleSpacebar = (event: KeyboardEvent) => {
        if (event.key === " " && !event.repeat && mounted.current) {
          event.preventDefault();
          if (ref && "current" in ref && ref.current) {
            (ref.current as CameraTransitionHandle).handleTransition();
          }
        }
      };

      window.addEventListener("keydown", handleSpacebar);
      return () => {
        window.removeEventListener("keydown", handleSpacebar);
      };
    }
  }, [isEntryScene, isMobile, ref]);

  useFrame((_, delta) => {
    if (cameraRef.current && isTransitioningRef.current && mounted.current) {
      const transitionSpeed = isMobile ? 2.0 : 1.5;
      cameraRef.current.position.lerp(targetPosition, delta * transitionSpeed);

      if (cameraRef.current.position.distanceTo(targetPosition) < 0.1) {
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={isMobile ? [0, 10, -25] : [0, 10, -20]}
      fov={isMobile ? 90 : 75}
    />
  );
});

CameraTransition.displayName = "CameraTransition";

export default CameraTransition;
