import { rubberBand } from "@/src/utils";
import { useTexture } from "@react-three/drei/native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { THREE } from "expo-three";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ImageColors from "react-native-image-colors";
import {
  SharedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const BookModel = ({
  rotateZ,
  coverUrl,
}: {
  rotateZ: SharedValue<number>;
  coverUrl: string;
}) => {
  const texture = useTexture(coverUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  const [dominantColor, setDominantColor] = useState(
    new THREE.Color(0.8, 0.8, 0.8)
  );

  useEffect(() => {
    const extractAndSetColor = async () => {
      try {
        const colors = await ImageColors.getColors(coverUrl, { cache: true });

        let colorHex =
          colors.platform === "ios" ? colors.background : colors.dominant;

        if (colorHex.startsWith("#")) colorHex = colorHex.substring(1);
        const r = parseInt(colorHex.substring(0, 2), 16) / 255;
        const g = parseInt(colorHex.substring(2, 4), 16) / 255;
        const b = parseInt(colorHex.substring(4, 6), 16) / 255;

        setDominantColor(new THREE.Color(r, g, b));
      } catch (error) {
        console.error("Failed to extract color:", error);
      }
    };

    if (coverUrl) {
      extractAndSetColor();
    }
  }, [coverUrl]);

  // Extract aspect ratio
  const width = texture.image?.width ?? 1;
  const height = texture.image?.height ?? 1;
  const aspectRatio = width / height;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -rotateZ.value;
    }
  });

  const bookMaterials = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({ color: dominantColor }), // Right Side
      new THREE.MeshStandardMaterial({ color: dominantColor }), // Left Side
      new THREE.MeshStandardMaterial({ color: dominantColor }), // Top
      new THREE.MeshStandardMaterial({ color: dominantColor }), // Bottom
      new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
      }), // Front (cover)
      new THREE.MeshStandardMaterial({ color: dominantColor }), // Back
    ];
  }, [texture, dominantColor]);

  const scaleFactor = 6;
  const thickness = 1; // New thickness constant

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      scale={[scaleFactor, scaleFactor, thickness]}
      material={bookMaterials}
    >
      <boxGeometry args={[aspectRatio, 1, 1]} />{" "}
    </mesh>
  );
};

const ThreeScene = ({ coverUrl }: { coverUrl: string }) => {
  const rotateZ = useSharedValue(0);
  const maxRotation = (45 * Math.PI) / 180;

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
        <Canvas
          events={null!}
          gl={{
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0, 10, 10]} intensity={3} />
          <directionalLight position={[-10, 0, -5]} intensity={1} />
          <Suspense>
            <BookModel rotateZ={rotateZ} coverUrl={coverUrl} />
          </Suspense>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export default ThreeScene;
