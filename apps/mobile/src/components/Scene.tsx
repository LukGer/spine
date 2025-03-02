import { Canvas } from "@react-three/fiber/native";
import React, { Suspense } from "react";
import { View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import BookModel from "./BookModel";

const ThreeScene = ({
  scroll,
  coverUrl,
  index,
}: {
  scroll: SharedValue<number>;
  coverUrl: string;
  index: number;
}) => {
  return (
    <View style={{ width: "100%", height: 400 }}>
      <Canvas events={null!}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 10]} intensity={2} />
        <Suspense>
          <BookModel scroll={scroll} coverUrl={coverUrl} index={index} />
        </Suspense>
      </Canvas>
    </View>
  );
};

export default ThreeScene;
