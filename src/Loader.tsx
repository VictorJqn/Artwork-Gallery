import React from "react";


interface LoaderProps {
  onLoadingComplete: () => void;
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete, isLoading }) => {
  return (
    <div style={styles.loader}>
      {isLoading ? (
        <div style={styles.animationContainer}>
          <div style={{ ...styles.dot, animationDelay: "0s" }}></div>
          <div style={{ ...styles.dot, animationDelay: "0.2s" }}></div>
          <div style={{ ...styles.dot, animationDelay: "0.4s" }}></div>
        </div>
      ) : (
        <button
          style={styles.button}
          onClick={onLoadingComplete}
          disabled={isLoading}
        >
          Play
        </button>
      )}
    </div>
  );
};

const styles = {
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    flexDirection: "column" as "column",
  },
  animationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  dot: {
    width: "15px",
    height: "15px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    animation: "bounce 1.2s infinite ease-in-out",
  },
  button: {
    padding: "20px 40px",
    fontSize: "18px",
    color: "white",
    backgroundColor: "transparent",
    border: "2px solid white",
    borderRadius: "30px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  "@keyframes bounce": {
    "0%, 80%, 100%": { transform: "scale(0)" },
    "40%": { transform: "scale(1)" },
  },
};

export default Loader;
