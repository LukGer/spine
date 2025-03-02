import ExpoTHREE, { THREE } from "expo-three";
import { useEffect, useState } from "react";

export function useTextureFromUrl(url: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTexture = async () => {
      const texture = (await ExpoTHREE.loadAsync(url)) as THREE.Texture;

      if (isMounted) {
        setTexture(texture);
      }
    };

    loadTexture();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}
