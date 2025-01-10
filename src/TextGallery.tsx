import { Text3D, useMatcapTexture } from "@react-three/drei";
import { useControls } from "leva";

export default function TextGallery() {
  const [matcapTexture] = useMatcapTexture("74A192_041B0D_194C33_235B4C");

  const textGallery = useControls("textGallery", {
    position: {
      value: [8.5, 22, 50],
      step: 0.01,
    },
    scale: {
      value: 2,
      step: 0.1,
    },
    rotationX: {
      value: 0,
      step: 0.01,
    },
  });
  
  return (
    <Text3D
      font="./fonts/Ephesis_Regular.json"
      position={textGallery.position}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
      scale={textGallery.scale}
      rotation-y={Math.PI}
      rotation-x={Math.PI * textGallery.rotationX}
    >
      <meshMatcapMaterial matcap={matcapTexture} />
      Capture memories
    </Text3D>
  );
}
