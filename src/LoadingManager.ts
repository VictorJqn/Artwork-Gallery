import * as THREE from 'three';

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
};

loadingManager.onLoad = () => {
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const progress = (itemsLoaded / itemsTotal) * 100;
};

loadingManager.onError = (url) => {
};

export default loadingManager;
