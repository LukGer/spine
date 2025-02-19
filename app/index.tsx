import { DbBook } from "@/src/db/schema";
import { getBooks } from "@/src/repository/books";
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
        style={{ paddingHorizontal: 26 }}
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
