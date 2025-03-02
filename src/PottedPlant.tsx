import { useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export default function PottedPlant() {
  const pottedPlantSettings = useControls("plant", {
    position: {
      value: [1.35, -1, 5],
      step: 0.01,
    },
    rotation: {
      value: -0.24,
      step: 0.01,
    },
    scale: {
      value: 1.3,
      step: 0.1,
    },
  });

  const pottedPlant = useLoader(
    GLTFLoader,
    "./potted_plant_02_1k/potted_plant_02_1k.gltf"
  );

  useMemo(() => {
    if (pottedPlant.scene) {
      pottedPlant.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.material.color.setRGB(1, 1, 1);
          child.material.color.multiplyScalar(0.4);
          if (child.material.emissive) {
            child.material.emissiveIntensity = 0.1;
          }
        }
      });
    }
  }, [pottedPlant.scene]);

  return (
    <>
      <primitive
        object={pottedPlant.scene}
        position={pottedPlantSettings.position}
        rotation-y={Math.PI * pottedPlantSettings.rotation}
        scale={pottedPlantSettings.scale}
      />
    </>
  );
}
