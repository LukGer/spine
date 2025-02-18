import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function AddPage() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: "Add new book" }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Add</Text>
      </View>
    </>
  );
}
