import BooksListItem from "@/src/components/BooksListItem";
import { useBooksQuery } from "@/src/repository/books";
import * as AppleColors from "@bacons/apple-colors";
import { LegendList } from "@legendapp/list";
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
  const query = useBooksQuery();

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
        style={{ paddingHorizontal: 16, paddingTop: 16 }}
      >
        <View style={{ flex: 1 }}>
          {query.isLoading && <ActivityIndicator />}

          {query.isError && <Text>Error: {query.error.message}</Text>}

          {query.isSuccess && (
            <LegendList
              style={{ paddingBottom: 72 }}
              data={query.data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <BooksListItem book={item} />}
              estimatedItemSize={220}
              ItemSeparatorComponent={() => (
                <View style={styles.listSeperator} />
              )}
            />
          )}

          {query.isSuccess && query.data.length === 0 && <EmptyState />}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  listSeperator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppleColors.separator,
    marginVertical: 16,
  },
});

const EmptyState = () => {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        height: 400,
      }}
    >
      <SymbolView name="tray" size={64} tintColor={AppleColors.systemOrange} />

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
  );
};
