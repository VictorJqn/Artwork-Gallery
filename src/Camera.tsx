import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function Camera() {

  // Chargement du modèle GLTF
  const cameraModel = useLoader(
    GLTFLoader,
    "./models/camera/Camera_01_1k.gltf"
  );

  return (
    <>
     
      <primitive
        object={cameraModel.scene}
        position={[-1.8, -1, 6]}
        rotation-y={Math.PI * 0.8}
        scale={3}
      />
    </>
  );
}
