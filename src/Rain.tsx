import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";

export default function Rain() {
  const rainRef = useRef<THREE.Points>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const rainParameters = useControls("rain", {
    speed: { value: 0.56, min: 0.001, max: 0.7, step: 0.01 },
    size: { value: 0.05, min: 0.001, max: 0.5, step: 0.01 },
  });

  const { positions, velocities } = useMemo(() => {
    const count = 1000; // Nombre de gouttes
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 50; 
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; 
      velocities[i] = Math.random() * 0.2 + rainParameters.speed; 
    }

    return { positions, velocities };
  }, [rainParameters.speed]);

 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(err => {
        console.error('Erreur lors de la lecture de l\'audio:', err);
      });
    }
  }, []);

   // Animation des gouttes de pluie
   useFrame((_, delta) => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] -= velocities[i] * (delta * 100);

        if (positions[i * 3 + 1] < -2) {
          positions[i * 3 + 1] = Math.random() * 50; 
          positions[i * 3 + 0] = (Math.random() - 0.5) * 50; 
          positions[i * 3 + 2] = (Math.random() - 0.5) * 50; 
        }
      }

      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  return (
    <>
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
