import { Canvas } from "@react-three/fiber";
import Gallery from "./Gallery";
import EntryScene from "./EntryScene";
import CameraTransition from "./CameraTransition";
import Rain from "./Rain";
import { Leva } from "leva";

export default function Experience() {
  return (
    <>
      <Leva collapsed />

      <Canvas shadows>
        x <color attach="background" args={["#000000"]} />
        <Gallery />
        <CameraTransition />
        <EntryScene />
        {/* <Cloud /> */}
        <Rain />
        <ambientLight intensity={0.1} />
      </Canvas>
    </>
  );
}
