import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useControls } from "leva";
import { useHelper, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import { useSpring, animated } from "@react-spring/three";
import Camera from "./Camera";
import Football from "./Football";
import { Physics, RigidBody } from "@react-three/rapier";
import loadingManager from './LoadingManager';  // Importer votre gestionnaire de chargement


// Liste des images pour les cadres
const images = [
  "./images/447.jpg",
  "./images/car.jpg",
  "./images/chairs.jpg",
  "./images/lac.jpg",
  "./images/montain.jpg",
  "./images/pizza.jpg",
  "./images/purple.jpg",
  "./images/restaurant.jpg",
  "./images/spain.jpg",
  "./images/vegetation.jpg",
];

export default function Gallery() {
  const { numElements, radius } = useControls("gallery", {
    numElements: { value: images.length, min: 1, max: 50, step: 1 },
    radius: { value: 7, min: 5, max: 20, step: 1 },
  });

  const spotlightSettings = useControls("spotLight", {
    color: { value: "white", label: "Couleur" },
    intensity: { value: 100, min: 0, max: 1000, step: 1, label: "Intensité" },
    distance: { value: 10, min: 0, max: 100, step: 1, label: "Distance" },
    angle: { value: 0.65, min: 0, max: 1, step: 0.01, label: "Angle" },
    penumbra: { value: 1, min: 0, max: 1, step: 0.01, label: "Pénombre" },
  });

  const leftArrowTexture = useLoader(TextureLoader, "./images/left-arrow.png");
  const rightArrowTexture = useLoader(TextureLoader, "./images/right-arrow.png");

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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const generatePositionsAndRotations = () => {
    const positionsAndRotations: {
      position: [number, number, number];
      rotation: [number, number, number];
    }[] = [];
    for (let i = 0; i < numElements; i++) {
      const angle = (i / numElements) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const rotationY = Math.atan2(x, z) + Math.PI;
      positionsAndRotations.push({
        position: [x, 0.2, z],
        rotation: [0, rotationY, 0],
      });
    }
    return positionsAndRotations;
  };

  const positionsAndRotations = generatePositionsAndRotations();

  const spotLight = useRef<THREE.SpotLight>(null) as React.MutableRefObject<THREE.SpotLight>;
  useHelper(spotLight, THREE.SpotLightHelper, 1);

  const gallery = useRef<THREE.Group>(null);

  const [targetRotation, setTargetRotation] = useState(0);

  useFrame((state, delta) => {
    if (gallery.current) {
      gallery.current.rotation.y += (targetRotation - gallery.current.rotation.y) * ( delta * 2.5);
    }
  });

  const rotateGallery = (direction: number) => {
    const angleStep = (Math.PI * 2) / numElements;
    setTargetRotation((prev) => prev + direction * angleStep);
  };

  const [hoveredArrows, setHoveredArrows] = useState({
    left: Array(numElements).fill(false),
    right: Array(numElements).fill(false),
  });

  // Créer une animation avec useSpring pour les flèches
  const arrowStyle = (hovered: boolean) =>
    useSpring({
      scale: hovered ? [1.5, 1.5, 1] : [1, 1, 1],
      emissiveIntensity: hovered ? 1 : 0,
      config: { tension: 300, friction: 20 }, // Ajuster la fluidité
    });

  return (
    <>
      <Perf position="top-left" />
      <spotLight
        position={[0, 2, 0]}
        color={spotlightSettings.color}
        intensity={spotlightSettings.intensity}
        distance={spotlightSettings.distance}
        angle={spotlightSettings.angle}
        penumbra={spotlightSettings.penumbra}
        ref={spotLight}
        target={(() => {
          const target = new THREE.Object3D();
          target.position.set(0, 1, 5);
          return target;
        })()}
      />
      <group ref={gallery}>
        {positionsAndRotations.map((item, index) => {
          const texture = textures[index] ?? textures[0]; // Utiliser la texture en cache

          const leftArrowAnim = arrowStyle(hoveredArrows.left[index]);
          const rightArrowAnim = arrowStyle(hoveredArrows.right[index]);

          return (
            <group key={index} position={item.position} rotation={item.rotation}>
              {/* Flèche gauche */}
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
                scale={leftArrowAnim.scale.to((x, y, z) => [x, y, z] as [number, number, number])}
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
                scale={rightArrowAnim.scale.to((x, y, z) => [x, y, z] as [number, number, number])}
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
      <Physics>
        <RigidBody type="fixed">
          <mesh position-y={-1} scale={100} rotation-x={-Math.PI / 2}>
            <planeGeometry />
            <MeshReflectorMaterial
              resolution={1024}
              mirror={1}
            />
          </mesh>
        </RigidBody>
        <Camera />
        <Football />
      </Physics>
    </>
  );
}
