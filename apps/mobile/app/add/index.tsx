import { client } from "@/src/api/client";
import AddBooksListItem from "@/src/components/AddBooksListItem";
import * as Form from "@/src/components/ui/Form";
import { useBooksQuery } from "@/src/repository/books";
import * as AppleColors from "@bacons/apple-colors";
import { LegendList } from "@legendapp/list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Stack, useFocusEffect, useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useState } from "react";
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
  const queryClient = useQueryClient();

  const existingBooksQuery = useBooksQuery();

  const [text, setText] = useState("");
  const [isbn, setIsbn] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const searchQuery = useQuery({
    queryKey: ["books", "search"],
    queryFn: async () => {
      const books = await client.books.query
        .$get({
          query: {
            title: text.length > 0 ? text : undefined,
            isbn: isbn.length > 0 ? isbn : undefined,
            lang: "de",
          },
        })
        .then((response) => response.json());

      return books;
    },
    enabled: false,
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        queryClient.resetQueries({ queryKey: ["books", "search"] });
        setText("");
        setIsbn("");
      };
    }, [queryClient])
  );

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
              <SymbolView
                name="chevron.backward"
                size={18}
                tintColor={AppleColors.systemBlue}
              />
              <Text style={{ color: AppleColors.systemBlue, fontSize: 18 }}>
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
            <Button
              title="Search"
              onPress={() => searchQuery.refetch()}
              disabled={searchQuery.isLoading || (!text && !isbn)}
            />
          </Form.Section>

          <View style={{ paddingHorizontal: 16, alignItems: "center" }}>
            {searchQuery.isLoading && <ActivityIndicator />}

            {searchQuery.isError && (
              <>
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
              </>
            )}

            {searchQuery.data && (
              <LegendList
                style={{ width: "100%", paddingBottom: 60 }}
                data={searchQuery.data}
                renderItem={({ item }) => (
                  <AddBooksListItem
                    book={item}
                    existingBooks={existingBooksQuery.data}
                  />
                )}
                keyExtractor={(item) => item.isbn}
                estimatedItemSize={456}
                ItemSeparatorComponent={() => (
                  <View style={styles.listSeperator} />
                )}
              />
            )}

            {searchQuery.isSuccess && searchQuery.data.length === 0 && (
              <>
                <SymbolView
                  name="magnifyingglass"
                  size={64}
                  tintColor={AppleColors.label}
                />
                <Text
                  style={{
                    color: AppleColors.label,
                  }}
                >
                  No books found
                </Text>
              </>
            )}
          </View>
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
  listSeperator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppleColors.separator,
    marginVertical: 8,
  },
});
