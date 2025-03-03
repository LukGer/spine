import { useIsFocused } from "@react-navigation/core";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { useIsForeground } from "../hooks/useIsForeground";

const PermissionsRequired = () => {
  const { hasPermission, requestPermission } = useCameraPermission();

  const openSettings = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  });

  return (
    <View style={styles.permissionsContainer}>
      <Text style={styles.permissionsText}>
        Camera access is required to scan barcodes
      </Text>
      <TouchableOpacity onPress={openSettings} style={styles.settingsButton}>
        <Text style={styles.settingsButtonText}>Open Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const scanAreaWidth = width * 0.8;
const scanAreaHeight = height * 0.2;
const scanAreaX = (width - scanAreaWidth) / 2;
const scanAreaY = (height - scanAreaHeight) / 2;

const CameraPreview = ({
  onBarcodeScanned,
  onCloseClicked,
}: {
  onBarcodeScanned: (code: string) => void;
  onCloseClicked: () => void;
}) => {
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const device = useCameraDevice("back");
  const insets = useSafeAreaInsets();
  const { hasPermission } = useCameraPermission();
  const [useFlash, setUseFlash] = useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13", "ean-8"],
    regionOfInterest: {
      x: scanAreaY,
      y: scanAreaX + scanAreaWidth,
      width: scanAreaHeight,
      height: scanAreaWidth,
    },
    onCodeScanned: ([code], cameraFrame) => {
      const { frame, value } = code;

      if (!frame || !value) return;

      console.log("SCANNED");

      // const {
      //   x: frameX,
      //   y: frameY,
      //   width: frameWidth,
      //   height: frameHeight,
      // } = frame;

      // const { width: camWidth, height: camHeight } = cameraFrame;

      // // Transform coordinates from landscape to portrait and normalize
      // const normalizedX = (camHeight - frameY - frameHeight) / camHeight;
      // const normalizedY = frameX / camWidth;

      // // Scale to screen dimensions
      // const screenX = normalizedX * width;
      // const screenY = normalizedY * height;

      // pointX.value = screenX;
      // pointY.value = screenY;

      // if (
      //   screenX >= scanAreaX &&
      //   screenX <= scanAreaX + scanAreaWidth &&
      //   screenY >= scanAreaY &&
      //   screenY <= scanAreaY + scanAreaHeight
      // ) {
      //   onBarcodeScanned(value);
      // } else {
      //   console.log("Barcode scanned outside of scan area", {
      //     screenX,
      //     screenY,
      //     scanAreaX,
      //     scanAreaY,
      //   });
      // }
    },
  });

  if (!hasPermission) {
    return <PermissionsRequired />;
  }

  if (!device) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        isActive={isActive}
        device={device}
        codeScanner={codeScanner}
        torch={useFlash ? "on" : "off"}
      />

      <View style={styles.hole} />

      <Text style={styles.helpText}>
        Center the barcode inside the rectangle
      </Text>

      <TouchableOpacity
        style={[
          styles.closeButton,
          {
            top: insets.top + 16,
          },
        ]}
        onPress={onCloseClicked}
      >
        <SymbolView name="xmark" size={24} tintColor="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.flashButton,
          {
            top: insets.top + 16,
          },
        ]}
        onPress={() => setUseFlash((prev) => !prev)}
      >
        <SymbolView
          name={useFlash ? "bolt.fill" : "bolt"}
          size={24}
          tintColor="white"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CameraPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    left: 16,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
  },
  flashButton: {
    position: "absolute",
    right: 16,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
  },

  hole: {
    position: "absolute",
    top: scanAreaY,
    left: scanAreaX,
    width: scanAreaWidth,
    height: scanAreaHeight,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  helpText: {
    alignSelf: "center",
    color: "white",
    marginTop: scanAreaHeight + 48,
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  permissionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  permissionsText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
});
