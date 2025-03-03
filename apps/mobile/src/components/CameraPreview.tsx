import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
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

const { width, height } = Dimensions.get("window");

const scanAreaWidth = width * 0.8;
const scanAreaHeight = height * 0.2;
const scanAreaX = (width - scanAreaWidth) / 2;
const scanAreaY = (height - scanAreaHeight) / 2;

const PermissionsRequired = () => {
  const openSettings = () => {
    Linking.openSettings();
  };

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

const CameraPreview = ({
  onBarcodeScanned,
  onCloseClicked,
}: {
  onBarcodeScanned: (code: string) => void;
  onCloseClicked: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const [permissions, requestPermissions] = useCameraPermissions();
  const [useFlash, setUseFlash] = useState(false);

  useEffect(() => {
    if (!permissions || !permissions.granted) {
      requestPermissions();
    }
  });

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    const { bounds, data } = result;

    let x = 0,
      y = 0;

    if (bounds.origin) {
      x = bounds.origin.x;
      y = bounds.origin.y;
    }

    if (
      x >= scanAreaX &&
      x <= scanAreaX + scanAreaWidth &&
      y >= scanAreaY &&
      y <= scanAreaY + scanAreaHeight
    ) {
      onBarcodeScanned(data);
    }
  };

  if (!permissions || !permissions.granted) {
    return <PermissionsRequired />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        enableTorch={useFlash}
      >
        <View style={styles.hole} />

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
      </CameraView>
    </View>
  );
};

export default CameraPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
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
