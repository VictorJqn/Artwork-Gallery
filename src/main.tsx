import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import Gallery from "./gallery.tsx";
import CameraTransition from "./CameraTransition"; 
import EntryScene from "./EntryScene.tsx";

const App = () => {
  return (
    <StrictMode>
      <Leva collapsed />
      <Canvas shadows>
x        <color attach="background" args={["#000000"]} />
        <Gallery />
        <CameraTransition /> 
        <EntryScene />
      </Canvas>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
