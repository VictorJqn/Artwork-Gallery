import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Experience from "./Experience";
import Loader from "./Loader";
import loadingManager from "./LoadingManager"; // Importer votre gestionnaire de chargement

const App = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mettre à jour l'état de chargement à chaque événement du LoadingManager
  useEffect(() => {
    loadingManager.onProgress = (_, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      console.log(`Loading ${progress}%`);
      if (progress === 100) {
        setIsLoading(false); // Lorsque tout est chargé, vous pouvez mettre à jour l'état
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
