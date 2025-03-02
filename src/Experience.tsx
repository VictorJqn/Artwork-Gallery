import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import Gallery from "./gallery";
import EntryScene from "./EntryScene";
import CameraTransition, { CameraTransitionHandle } from "./CameraTransition";
import TransitionButton from "./TransitionButton";
import Rain from "./Rain";
import { Leva } from "leva";

interface ExperienceProps {
  isLoading?: boolean;
  isAudioStarted?: boolean;
}

export default function Experience({
  isLoading = false,
  isAudioStarted = false,
}: ExperienceProps) {
  const cameraTransitionRef = useRef<CameraTransitionHandle>(null);

  const handleTransitionStart = () => {
    if (cameraTransitionRef.current) {
      cameraTransitionRef.current.handleTransition();
    }
  };

  return (
    <>
      <Leva hidden={true} />

      <Canvas shadows>
        <color attach="background" args={["#000000"]} />
        <Gallery />
        <CameraTransition
          ref={cameraTransitionRef}
          onTransitionStart={handleTransitionStart}
        />
        <EntryScene />
        <Rain />
        <ambientLight intensity={0.08} />
      </Canvas>

      <TransitionButton
        onTransition={handleTransitionStart}
        isLoading={isLoading}
        isAudioStarted={isAudioStarted}
      />
    </>
  );
}
