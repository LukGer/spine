import { client } from "@/src/api/client";
import * as Form from "@/src/components/ui/Form";
import * as AppleColors from "@bacons/apple-colors";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Stack, useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddPage() {
  const navigation = useNavigation();

  const [text, setText] = useState("");
  const [isbn, setIsbn] = useState("");

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

              <TouchableOpacity style={{ padding: 4 }}>
                <SymbolView name="barcode.viewfinder" size={24} />
              </TouchableOpacity>
            </Form.HStack>
            <Button title="Search" onPress={() => searchQuery.refetch()} />
          </Form.Section>

          {searchQuery.isLoading && <ActivityIndicator />}

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
        </Form.List>
      </View>
    </>
  );
}
