import { client } from "@/src/api/client";
import AddBooksListItem from "@/src/components/AddBooksListItem";
import CameraPreview from "@/src/components/CameraPreview";
import * as Form from "@/src/components/ui/Form";
import * as AppleColors from "@bacons/apple-colors";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useFocusEffect, useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddPage() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [text, setText] = useState("");
  const [isbn, setIsbn] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const searchQuery = useQuery({
    queryKey: ["books", "search"],
    queryFn: async () => {
      const response = await client.books.query.$get({
        query: {
          q: text.length > 0 ? text : undefined,
          isbn: isbn.length > 0 ? isbn : undefined,
          lang: "de",
        },
      });

      if (!response) {
        throw new Error("No books found");
      }

      const books = await response.json();

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
              <FlatList
                scrollEnabled={false}
                style={{ width: "100%", paddingBottom: 60 }}
                data={searchQuery.data}
                renderItem={({ item }) => <AddBooksListItem book={item} />}
                keyExtractor={(item) => item.isbn}
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

const styles = StyleSheet.create({
  listSeperator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppleColors.separator,
    marginVertical: 8,
  },
});
