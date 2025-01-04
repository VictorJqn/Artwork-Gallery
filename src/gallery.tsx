import React, { useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useControls } from "leva";
import { useHelper, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Perf } from "r3f-perf";

// Liste des images pour les cadres
const images = [
  "./447.jpg",
  "./car.jpg",
  "./chairs.jpg",
  "./lac.jpg",
  "./montain.jpg",
  "./pizza.jpg",
  "./purple.jpg",
  "./restaurant.jpg",
  "./spain.jpg",
  "./vegetation.jpg",
];

const woodTexture = {
  arm: "./wood_table_001_1k/wood_table_001_arm_1k.jpg",
  diff: "./wood_table_001_1k/wood_table_001_diff_1k.jpg",
  nor_gl: "./wood_table_001_1k/wood_table_001_nor_gl_1k.jpg",
};

export default function Gallery() {
  const { numElements, radius } = useControls({
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

  const armTexture = useLoader(TextureLoader, woodTexture.arm);
  const diffTexture = useLoader(TextureLoader, woodTexture.diff);
  const nor_glTexture = useLoader(TextureLoader, woodTexture.nor_gl);

  const leftArrowTexture = useLoader(TextureLoader, "./left-arrow.png");
  const rightArrowTexture = useLoader(TextureLoader, "./right-arrow.png");

  const generatePositionsAndRotations = () => {
    const positionsAndRotations: {
      position: [number, number, number];
      rotation: [number, number, number];
    }[] = [];
    for (let i = 0; i < numElements; i++) {
      const angle = (i / numElements) * Math.PI * 2 ; // Appliquer le décalage ici
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
  
      // Rotation pour faire face au centre
      const rotationY = Math.atan2(x, z) + Math.PI;
      positionsAndRotations.push({
        position: [x, 0.2, z],
        rotation: [0, rotationY, 0],
      });
    }
    return positionsAndRotations;
  };

  const positionsAndRotations = generatePositionsAndRotations();

  const spotLight = useRef<THREE.SpotLight>(
    null
  ) as React.MutableRefObject<THREE.SpotLight>;
  useHelper(spotLight, THREE.SpotLightHelper, 1);

  const gallery = useRef<THREE.Group>(null);
  const [targetRotation, setTargetRotation] = useState(0);

  useFrame(() => {
    if (gallery.current) {
      gallery.current.rotation.y += (targetRotation - gallery.current.rotation.y) * 0.025; // Animation fluide
    }
  });
  
  const rotateGallery = (direction: number) => {
    const angleStep = (Math.PI * 2) / numElements;
    setTargetRotation((prev) => prev + direction * angleStep);
  };

  return (
    <>
    <Perf position="top-left"/>
      {/* <ambientLight intensity={0.5} /> */}
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
      <group ref={gallery} >
        {positionsAndRotations.map((item, index) => {
          const texture = useLoader(TextureLoader, images[index] ?? images[0]);

          return (
            
              <group
                key={index}
                position={item.position}
                rotation={item.rotation}
              >
                <mesh
                  position={[-1.8, 0, 0.5]}
                  onClick={() => rotateGallery(-1)}
                >
                  <boxGeometry args={[0.3, 0.3, 0.001]} />
                  <meshStandardMaterial map={leftArrowTexture} transparent />
                </mesh>
                {/* Cadre autour de la box avec la texture choisie */}
                <mesh>
                  <boxGeometry args={[3.2, 2.2, 0.1]} />
                  <meshStandardMaterial
                    color={"#333333"}
                  />
                </mesh>
                {/* Image à l'intérieur du cadre */}
                <mesh position={[0, 0, 0.05]}>
                  <boxGeometry args={[3, 2, 0.1]} />
                  <meshStandardMaterial map={texture} />
                </mesh>

                <mesh position={[1.8, 0, 0.5]} onClick={() => rotateGallery(1)}>
                  <boxGeometry args={[0.3, 0.3, 0.001]} />
                  <meshStandardMaterial map={rightArrowTexture} transparent />
                </mesh>
              </group>
            
          );
        })}
      </group>
      {/* Reflet du sol */}
      <mesh position-y={-1} scale={100} rotation-x={-Math.PI / 2}>
        <planeGeometry />
        <MeshReflectorMaterial
          resolution={1024}
          mirror={1}
          blur={[1000, 1000]}
          mixBlur={0}
        />
      </mesh>
    </>
  );
}
