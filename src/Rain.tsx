import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";

export default function Rain() {
  const rainRef = useRef<THREE.Points>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Contrôles de Leva pour la pluie
  const rainParameters = useControls("rain", {
    speed: { value: 0.14, min: 0.001, max: 0.4, step: 0.01 },
    size: { value: 0.05, min: 0.001, max: 0.5, step: 0.01 },
  });

  // Génération des positions initiales et des vitesses des gouttes de pluie
  const { positions, velocities } = useMemo(() => {
    const count = 1000; // Nombre de gouttes
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    // Initialisation des positions et des vitesses des gouttes
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50; // X entre -width/2 et width/2
      positions[i * 3 + 1] = Math.random() * 50; // Y entre 0 et height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // Z entre -depth/2 et depth/2
      velocities[i] = Math.random() * 0.2 + rainParameters.speed; // Vitesse de chute
    }

    return { positions, velocities };
  }, [rainParameters.speed]);

  // Animation des gouttes de pluie
  useFrame((state, delta) => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length / 3; i++) {
        // Mise à jour de la position Y
        positions[i * 3 + 1] -= velocities[i] * (delta * 100);

        // Si la goutte atteint Y = -1, réinitialiser sa position
        if (positions[i * 3 + 1] < -2) {
          positions[i * 3 + 1] = Math.random() * 50; // Réinitialiser Y entre 0 et height
          positions[i * 3 + 0] = (Math.random() - 0.5) * 50; // Réinitialiser X entre -width/2 et width/2
          positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // Réinitialiser Z entre -depth/2 et depth/2
        }
      }

      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(err => {
        console.error('Erreur lors de la lecture de l\'audio:', err);
      });
    }
  }, []);
  return (
    <>
      {/* Son de pluie */}
      {/* Mettre le bon chemin du fichier audio */}
      {/* Pluie */}
      <Points ref={rainRef} positions={positions}>
        <PointMaterial
          transparent
          color="#aaaaaa"
          size={rainParameters.size}
          sizeAttenuation
        />
      </Points>
    </>
  );
}
