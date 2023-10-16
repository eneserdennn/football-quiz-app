import { Appearance, Platform, SafeAreaView, Text, View } from "react-native";

import { Link } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

const CustomHeader = () => {
  const colorScheme = Appearance.getColorScheme(); // 'dark' veya 'light' döner.

  return (
    <SafeAreaView
      className="flex bg-[#27374D] justify-between items-center px-4"
      style={{ paddingTop: Platform.OS === "android" ? 25 : 0 }}
    >
      <StatusBar style="dark" />
      <Link href="/">
        <View className="flex items-center justify-center">
          <Text className="font-semibold text-lg text-[#DDE6ED]">Home</Text>
        </View>
      </Link>
      <View className="h-14 justify-center items-center">
        <Text className="font-semibold text-lg text-[#DDE6ED]">
          Guess Player
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
