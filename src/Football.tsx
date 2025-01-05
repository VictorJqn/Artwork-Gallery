import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function Football() {
  // Chargement du modèle GLTF
  const footballModel = useLoader(
    GLTFLoader,
    "./models/football/dirty_football_1k.gltf"
  );

  const ball = useRef<any>(null);

  const mooveBall = () => {
    console.log(ball); // Vérification de la référence
    if (ball.current) {
      // Applique une impulsion sur le RigidBody, en accédant à sa méthode interne.
      const rigidBody = ball.current;  // Récupération de l'objet RigidBody
      console.log("apply impulse");

      // Applique l'impulsion via la méthode `applyImpulse` du RigidBody
      rigidBody.applyImpulse({ x: 0, y: 10, z: 0 }, [0, 0, 0]);  // Le second paramètre est la position du point d'application de l'impulsion
    }
  };

  return (
    <>
      {/* <RigidBody colliders="ball" ref={ball}> */}
        <primitive
          object={footballModel.scene}
          position={[1.8, -1 , 6]}
          scale={1.5}
          onClick={mooveBall} // Appel de la fonction correctement
        />
      {/* </RigidBody> */}
    </>
  );
}
