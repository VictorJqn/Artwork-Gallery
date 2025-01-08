import React from 'react';

interface LoaderProps {
  onLoadingComplete: () => void;
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete, isLoading }) => {
  return (
    <div style={styles.loader}>
      <button
        style={styles.button}
        onClick={onLoadingComplete}
        disabled={isLoading}
      >
        {isLoading ? 'Chargement...' : 'Play'}
      </button>
    </div>
  );
};

const styles = {
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'black',
  },
  button: {
    padding: '20px 40px',
    fontSize: '18px',
    color: 'white',
    backgroundColor: 'transparent',
    border: '2px solid white',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
  },
};

export default Loader;
