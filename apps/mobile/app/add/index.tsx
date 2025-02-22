import { client } from "@/src/api/client";
import * as Form from "@/src/components/ui/Form";
import * as AppleColors from "@bacons/apple-colors";
import { useQuery } from "@tanstack/react-query";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";
import { Stack, useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddPage() {
  const navigation = useNavigation();

  const [text, setText] = useState("");
  const [isbn, setIsbn] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const searchQuery = useQuery({
    queryKey: ["books", "search"],
    queryFn: async () => {
      return await client.books.query
        .$get({
          query: {
            title: text.length > 0 ? text : undefined,
            isbn: isbn.length > 0 ? isbn : undefined,
            lang: "de",
          },
        })
        .then((response) => response.json());
    },
    enabled: false,
  });

  const onBarcodeScanned = (code: string) => {
    setIsbn(code);
    setShowCamera(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                padding: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => navigation.goBack()}
            >
              <SymbolView name="chevron.backward" size={18} />
              <Text style={{ color: AppleColors.link, fontSize: 18 }}>
                Back
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Form.List>
          <Form.Section title="Search for a book">
            <Form.TextInput
              value={text}
              placeholder="Title"
              onChange={(e) => setText(e.nativeEvent.text)}
            />

            <Form.HStack>
              <Form.TextInput
                value={isbn}
                placeholder="ISBN"
                keyboardType="number-pad"
                onChange={(e) => setIsbn(e.nativeEvent.text)}
              />

              <TouchableOpacity
                style={{ padding: 4 }}
                onPress={() => setShowCamera(true)}
              >
                <SymbolView name="barcode.viewfinder" size={24} />
              </TouchableOpacity>
            </Form.HStack>
            <Button title="Search" onPress={() => searchQuery.refetch()} />
          </Form.Section>

          {searchQuery.isLoading && <ActivityIndicator />}

          {searchQuery.isError && (
            <View style={{ paddingHorizontal: 16, alignItems: "center" }}>
              <SymbolView
                name="exclamationmark.triangle"
                size={64}
                tintColor={AppleColors.systemRed}
              />

              <Text
                style={{
                  color: AppleColors.systemRed,
                }}
              >
                Error: {searchQuery.error.message}
              </Text>

              <Button title="Retry" onPress={() => searchQuery.refetch()} />
            </View>
          )}

          {searchQuery.isSuccess &&
            searchQuery.data.map((book) => (
              <View>
                <Image
                  source={book.thumbnailUrl}
                  style={{
                    height: 350,
                    width: 250,
                  }}
                />
                <Text>{book.title}</Text>
              </View>
            ))}

          {searchQuery.isSuccess && searchQuery.data.length === 0 && (
            <View>
              <SymbolView
                name="magnifyingglass"
                size={64}
                tintColor="rgba(255, 255, 255, 0.6)"
              />
              <Text
                style={{
                  color: AppleColors.lightText,
                }}
              >
                No books found
              </Text>
            </View>
          )}
        </Form.List>
        <Modal
          animationType="slide"
          visible={showCamera}
          onRequestClose={() => {
            setShowCamera(false);
          }}
        >
          <CameraPreview
            onBarcodeScanned={onBarcodeScanned}
            onCloseClicked={() => setShowCamera(false)}
          />
        </Modal>
      </View>
    </>
  );
}

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
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
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
  // The overlay darkens the camera view. It is only visible where the mask is opaque.
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});
