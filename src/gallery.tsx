import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useControls } from "leva";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";

import Camera from "./Camera";
import loadingManager from "./LoadingManager";
import PottedPlant from "./PottedPlant";
import TextGallery from "./TextGallery";
import { images } from "./ImagesData";

export default function Gallery() {
  const gallery = useRef<THREE.Group>(null);
  const touchStartX = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [targetRotation, setTargetRotation] = useState(0);
  const { scene } = useThree(); // Accès à la scène principale
  const spotLightTarget = useMemo(() => new THREE.Object3D(), []); // Memo pour conserver la même instance

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { numElements, radius } = useControls("gallery", {
    numElements: { value: images.length, min: 1, max: 50, step: 1 },
    radius: { value: 7, min: 5, max: 20, step: 1 },
  });

  const [hoveredArrows, setHoveredArrows] = useState({
    left: Array(numElements).fill(false),
    right: Array(numElements).fill(false),
  });

  const spotLight = useRef<THREE.SpotLight>(
    null
  ) as React.MutableRefObject<THREE.SpotLight>;

  const spotlightSettings = useControls("spotLight", {
    intensity: {
      value: 100,
      min: 0,
      max: 1000,
      step: 1,
      label: "Intensité",
    },
    distance: {
      value: 10,
      min: 0,
      max: 100,
      step: 1,
      label: "Distance",
    },
    angle: { value: 0.65, min: 0, max: 1, step: 0.01, label: "Angle" },
    penumbra: { value: 1, min: 0, max: 1, step: 0.01, label: "Pénombre" },
  });

  const arrowStyle = (hovered: boolean) =>
    useSpring({
      scale: hovered ? [1.5, 1.5, 1] : [1, 1, 1],
      emissiveIntensity: hovered ? 1 : 0,
      config: { tension: 300, friction: 20 },
    });

  const leftArrowTexture = useLoader(TextureLoader, "./images/left-arrow.png");
  const rightArrowTexture = useLoader(
    TextureLoader,
    "./images/right-arrow.png"
  );

  const textures = useMemo(() => {
    return images.map((image) => {
      return new THREE.TextureLoader(loadingManager).load(image);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        rotateGallery(-1);
      } else if (event.key === "ArrowRight") {
        rotateGallery(1);
      }
    };

    // Gestion du swipe sur mobile
    const handleTouchStart = (event: TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartX.current === null) return;

      const touchEndX = event.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;

      // Seuil minimum pour détecter un swipe
      if (Math.abs(deltaX) > 50) {
        rotateGallery(deltaX > 0 ? -1 : 1);
      }

      touchStartX.current = null;
    };

    window.addEventListener("keydown", handleKeyDown);
    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isMobile]);

  const rotateGallery = (direction: number) => {
    const angleStep = (Math.PI * 2) / numElements;
    const rotationSpeed = 1; // Rotation plus rapide sur mobile
    setTargetRotation((prev) => prev + direction * angleStep * rotationSpeed);
  };

  const positionsAndRotations = useMemo(() => {
    const positions = [];
    for (let i = 0; i < numElements; i++) {
      const angle = (i / numElements) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const rotationY = Math.atan2(x, z) + Math.PI;
      positions.push({
        position: [x, isMobile ? 0 : 0.2, z] as [number, number, number],
        rotation: [0, rotationY, 0],
      });
    }
    return positions;
  }, [numElements, radius, isMobile]);

  useEffect(() => {
    scene.add(spotLightTarget);
    spotLightTarget.position.set(0, 1, 5);
    return () => {
      scene.remove(spotLightTarget);
    };
  }, [scene]);

  useFrame((_, delta) => {
    if (gallery.current) {
      const rotationSpeed = isMobile ? 3.5 : 2.5;
      gallery.current.rotation.y +=
        (targetRotation - gallery.current.rotation.y) * (delta * rotationSpeed);
    }
  });

  return (
    <>
      {/* <Perf position="top-left"d/> */}
      <spotLight
        position={[0, 2, 0]}
        intensity={spotlightSettings.intensity}
        distance={spotlightSettings.distance}
        angle={spotlightSettings.angle}
        penumbra={spotlightSettings.penumbra}
        ref={spotLight}
        target={spotLightTarget}
      />
      <group ref={gallery}>
        {positionsAndRotations.map((item, index) => {
          const texture = textures[index] ?? textures[0];

          const leftArrowAnim = arrowStyle(hoveredArrows.left[index]);
          const rightArrowAnim = arrowStyle(hoveredArrows.right[index]);

          return (
            <group
              key={index}
              position={item.position}
              rotation={new THREE.Euler(...item.rotation)}
            >
              <animated.mesh
                position={[-1.8, 0, 0.5]}
                onPointerOver={() => {
                  setHoveredArrows((prev) => {
                    const newHovered = { ...prev };
                    newHovered.left[index] = true;
                    return newHovered;
                  });
                }}
                onPointerOut={() => {
                  setHoveredArrows((prev) => {
                    const newHovered = { ...prev };
                    newHovered.left[index] = false;
                    return newHovered;
                  });
                }}
                onClick={() => rotateGallery(-1)}
                scale={leftArrowAnim.scale.to(
                  (x, y, z) => [x, y, z] as [number, number, number]
                )}
              >
                <boxGeometry args={[0.3, 0.3, 0.001]} />
                <animated.meshStandardMaterial
                  map={leftArrowTexture}
                  emissive={new THREE.Color(0.5, 0.5, 0.5)}
                  emissiveIntensity={leftArrowAnim.emissiveIntensity}
                  transparent={true}
                />
              </animated.mesh>

              {/* Cadre image */}
              <mesh>
                <boxGeometry args={[3.2, 2.2, 0.1]} />
                <meshStandardMaterial color={"#333333"} />
              </mesh>

              {/* Image */}
              <mesh position={[0, 0, 0.05]}>
                <boxGeometry args={[3, 2, 0.1]} />
                <meshStandardMaterial map={texture} />
              </mesh>

              {/* Flèche droite */}
              <animated.mesh
                position={[1.8, 0, 0.5]}
                onPointerOver={() => {
                  setHoveredArrows((prev) => {
                    const newHovered = { ...prev };
                    newHovered.right[index] = true;
                    return newHovered;
                  });
                }}
                onPointerOut={() => {
                  setHoveredArrows((prev) => {
                    const newHovered = { ...prev };
                    newHovered.right[index] = false;
                    return newHovered;
                  });
                }}
                onClick={() => rotateGallery(1)}
                scale={rightArrowAnim.scale.to(
                  (x, y, z) => [x, y, z] as [number, number, number]
                )}
              >
                <boxGeometry args={[0.3, 0.3, 0.001]} />
                <animated.meshStandardMaterial
                  map={rightArrowTexture}
                  transparent
                  emissive={new THREE.Color(0.5, 0.5, 0.5)}
                  emissiveIntensity={rightArrowAnim.emissiveIntensity}
                />
              </animated.mesh>
            </group>
          );
        })}
      </group>
      {/* Reflet du sol */}
      <mesh position-y={-1} scale={100} rotation-x={-Math.PI / 2}>
        <planeGeometry />
        <MeshReflectorMaterial resolution={1024} mirror={1} />
      </mesh>
      <Camera />
      <PottedPlant />
      <TextGallery />
    </>
  );
}
