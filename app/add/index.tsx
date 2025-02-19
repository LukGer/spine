import * as Form from "@/src/components/ui/Form";
import * as AppleColors from "@bacons/apple-colors";
import { useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function AddPage() {
  const navigation = useNavigation();

  const [text, setText] = useState("");

  return (
    <>
      <View style={{ flex: 1 }}>
        <Form.List>
          <TouchableOpacity
            style={{
              marginHorizontal: 16,
              padding: 4,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <SymbolView name="chevron.backward" size={18} />
            <Text style={{ color: AppleColors.link, fontSize: 18 }}>Back</Text>
          </TouchableOpacity>
          <Form.Section title="Search for a book">
            <Form.HStack>
              <Form.TextInput
                value={text}
                placeholder="ISBN"
                keyboardType="number-pad"
                onChange={(e) => setText(e.nativeEvent.text)}
              />

              <TouchableOpacity style={{ padding: 4 }}>
                <SymbolView name="barcode.viewfinder" size={24} />
              </TouchableOpacity>
            </Form.HStack>
            <Button title="Search" />
          </Form.Section>
        </Form.List>
      </View>
    </>
  );
}
