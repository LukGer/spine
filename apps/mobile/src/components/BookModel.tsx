import { Gltf } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { THREE } from "expo-three";
import { useRef } from "react";
import { interpolate, SharedValue } from "react-native-reanimated";
import { degToRad } from "three/src/math/MathUtils";
import BookGlb from "../../assets/models/book_closed_2.glb";
import { useTextureFromUrl } from "../hooks/useTextureFromUrl";

const BookModel = ({
  scroll,
  coverUrl,
  index,
}: {
  scroll: SharedValue<number>;
  coverUrl: string;
  index: number;
}) => {
  const meshRef = useRef<THREE.Group>(null);

  const coverTexture = useTextureFromUrl(coverUrl);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = interpolate(
        scroll.value + 150,
        [index * 500 - 500, index * 500, index * 500 + 500],
        [degToRad(-20), 0, degToRad(-20)],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );
    }
  });

  const width = coverTexture?.image?.width || 0;
  const height = coverTexture?.image?.height || 0;

  return (
    <group ref={meshRef} rotation={[Math.PI / 2, 0, 0]} scale={0.25}>
      <Gltf src={BookGlb}></Gltf>

      {coverTexture && (
        <mesh
          scale={0.05}
          position={[0, -0.5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={coverTexture} transparent />
        </mesh>
      )}
    </group>
  );
};

export default BookModel;
