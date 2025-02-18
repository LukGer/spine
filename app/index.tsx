import { getBooks } from "@/src/repository/books";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

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
              <SymbolView name="square.grid.2x2.fill" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        {query.isLoading && <ActivityIndicator />}

        {query.isSuccess && <Text>{query.data.length} books found</Text>}
      </View>
    </>
  );
}
