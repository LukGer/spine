import migrations from "@/drizzle/migrations";
import { db } from "@/src/db";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { BlurView } from "expo-blur";
import { Link, Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
        }}
      >
        <Text style={{ color: "white" }}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="add" options={{ presentation: "modal" }} />
      </Stack>

      <BottomBar />
    </QueryClientProvider>
  );
}

const BottomBar = () => {
  return (
    <BlurView style={bottomBarStyle.container}>
      <View style={bottomBarStyle.buttonContainer}>
        <Link href="/" asChild replace>
          <TouchableOpacity style={bottomBarStyle.button}>
            <SymbolView name="house" tintColor="black" />
          </TouchableOpacity>
        </Link>

        <Link href="/add" asChild>
          <TouchableOpacity style={bottomBarStyle.button}>
            <SymbolView name="plus" tintColor="black" />
          </TouchableOpacity>
        </Link>
        <Link href="/profile" asChild replace>
          <TouchableOpacity style={bottomBarStyle.button}>
            <SymbolView name="person" tintColor="black" />
          </TouchableOpacity>
        </Link>
      </View>
    </BlurView>
  );
};

const bottomBarStyle = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 86,
    alignItems: "center",
  },

  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 48,
  },

  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "black",
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
});
