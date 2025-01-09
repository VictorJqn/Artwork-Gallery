import { useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function Camera() {
  const cameraSettings = useControls("camera", {
    position: {
      value: [-1.2, -1, 4.4],
      step: 0.01,
    },
    rotation: {
      value: 0.8,
      step: 0.01,
    },
    scale: {
      value: 3.3,
      step: 0.1,
    },
  });

  const cameraModel = useLoader(
    GLTFLoader,
    "./models/camera/Camera_01_1k.gltf"
  );

  return (
    <>
      <primitive
        object={cameraModel.scene}
        position={cameraSettings.position}
        rotation-y={Math.PI * cameraSettings.rotation}
        scale={cameraSettings.scale}
      />
    </>
  );
}
