import { rubberBand } from "@/src/utils";
import { Gltf } from "@react-three/drei/native";
import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import { TextureLoader, THREE } from "expo-three";
import { FastAverageColor } from "fast-average-color";
import React, { Suspense, useEffect, useRef } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SharedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import BookGlb from "../../assets/models/book_closed_2.glb";

const BookModel = ({
  rotateZ,
  coverUrl,
}: {
  rotateZ: SharedValue<number>;
  coverUrl: string;
}) => {
  const texture = useLoader(TextureLoader, coverUrl);

  const [dominantColor, setDominantColor] = React.useState<string | null>(null);

  const width = texture.image?.width ?? 1;
  const height = texture.image?.height ?? 1;

  useEffect(() => {
    const fac = new FastAverageColor();

    async function loadImageData() {
      const color = await fac.getColorAsync(coverUrl);
      setDominantColor(color.hex);

      console.log("DOMINANT COLOR: ", color.hex);
    }

    loadImageData();

    return () => {
      fac.destroy();
    };
  }, [coverUrl, height, width]);

  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = rotateZ.value;
    }
  });

  return (
    <group ref={meshRef} rotation={[Math.PI / 2, 0, 0]} scale={0.25}>
      <Gltf src={BookGlb}></Gltf>
      <mesh position={[0, 4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width / 20, height / 20]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
};

const ThreeScene = ({ coverUrl }: { coverUrl: string }) => {
  const rotateZ = useSharedValue(0);
  const maxRotation = (12 * Math.PI) / 180;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const rawRotation = -event.translationX / 400;
      rotateZ.value = rubberBand(rawRotation, maxRotation);
    })
    .onEnd(() => {
      rotateZ.value = withSpring(0, {
        damping: 20,
        stiffness: 80,
      });
    });

  return (
    <View style={{ width: "100%", height: 400 }}>
      <GestureDetector gesture={panGesture}>
        <Canvas events={null!}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 10, 10]} intensity={2} />
          <Suspense>
            <BookModel rotateZ={rotateZ} coverUrl={coverUrl} />
          </Suspense>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export default ThreeScene;
