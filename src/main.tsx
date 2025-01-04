import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { OrbitControls } from "@react-three/drei";
import Gallery from "./gallery.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Leva collapsed />
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 0, 0],
      }}
    >
      <OrbitControls target={[0, 0, 10]} />
      <color attach="background" args={["#000000"]} />
      <Gallery />
    </Canvas>
  </StrictMode>
);
