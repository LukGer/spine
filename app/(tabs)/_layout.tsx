import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs tabBar={TabBar} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: () => <SymbolView name="house" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => <SymbolView name="person" />,
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}

const TabBar = ({ navigation }: BottomTabBarProps) => {
  return (
    <View style={bottomBarStyle.tabBarContainer}>
      <View style={bottomBarStyle.tabBar}>
        <TouchableOpacity
          style={bottomBarStyle.button}
          onPress={() => navigation.navigate("home")}
        >
          <SymbolView name="house" tintColor="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={bottomBarStyle.button}
          onPress={() => navigation.navigate("add/index")}
        >
          <SymbolView name="plus" tintColor="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("profile")}
          style={bottomBarStyle.button}
        >
          <SymbolView name="person" tintColor="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const bottomBarStyle = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    alignItems: "center",
  },
  tabBar: {
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
