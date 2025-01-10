import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

import Experience from "./Experience";
import loadingManager from "./LoadingManager"; 
import Loader from "./Loader";
import "./index.css";

const App = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadingManager.onProgress = (_, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      console.log(`Loading ${progress}%`);
      if (progress === 100) {
        setIsLoading(false); 
      }
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    if (audioRef.current) {
      audioRef.current.play();
      setIsAudioStarted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} id="rain-audio" src="./song/rain.ogg" loop />

      {!isAudioStarted ? (
        <Loader
          onLoadingComplete={handleLoadingComplete}
          isLoading={isLoading}
        />
      ) : null}
      <Experience />
    </>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
