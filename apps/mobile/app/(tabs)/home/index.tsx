import { DbBook } from "@/src/db/schema";
import { getBooks } from "@/src/repository/books";
import * as AppleColors from "@bacons/apple-colors";
import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomePage() {
  const query = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Your Bookshelf",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },

          headerRight: () => (
            <TouchableOpacity>
              <SymbolView name="square.grid.2x2.fill" tintColor="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingHorizontal: 16 }}
      >
        <View style={{ flex: 1 }}>
          {query.isLoading && <ActivityIndicator />}

          {query.isError && <Text>Error: {query.error.message}</Text>}

          {query.isSuccess && (
            <LegendList
              data={query.data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <BookListItem book={item} />}
              estimatedItemSize={220}
            />
          )}

          {query.isSuccess && query.data.length === 0 && (
            <View
              style={{
                paddingHorizontal: 16,
                alignItems: "center",
                justifyContent: "center",
                height: 400,
              }}
            >
              <SymbolView
                name="tray"
                size={64}
                tintColor={AppleColors.systemOrange}
              />

              <Text
                style={{
                  color: AppleColors.label,
                  marginTop: 16,
                  fontSize: 20,
                }}
              >
                You don't have any books yet.
              </Text>

              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    color: AppleColors.secondaryLabel,
                    fontSize: 16,
                  }}
                >
                  Add books by tapping the
                </Text>

                <SymbolView
                  name="plus"
                  size={16}
                  tintColor={AppleColors.systemOrange}
                />

                <Text
                  style={{
                    color: AppleColors.secondaryLabel,
                    fontSize: 16,
                  }}
                >
                  below.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const BookListItem = ({ book }: { book: DbBook }) => {
  const imgSrc = book.thumbnailUrl?.replace("http://", "https://");

  return (
    <View style={bookItemStyle.container}>
      <Image source={imgSrc} style={bookItemStyle.image} contentFit="contain" />
      <Text style={bookItemStyle.title}>{book.title}</Text>
    </View>
  );
};

const bookItemStyle = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    height: 350,
    width: 250,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
