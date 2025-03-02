import { useEffect, useState } from "react";

interface TransitionButtonProps {
  onTransition: () => void;
  isLoading?: boolean;
  isAudioStarted?: boolean;
}

export default function TransitionButton({
  onTransition,
  isLoading = false,
  isAudioStarted = false,
}: TransitionButtonProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || isLoading || !isAudioStarted) return null;

  return (
    <button
      onClick={onTransition}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "15px 30px",
        fontSize: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        border: "1px solid white",
        borderRadius: "25px",
        cursor: "pointer",
        zIndex: 1000,
        transition: "all 0.3s ease",
      }}
    >
      Transition
    </button>
  );
}
