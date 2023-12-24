import { Text, View } from "react-native";

import { Image } from "react-native";
import Images from "@/constants/Images";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import mobileAds from "react-native-google-mobile-ads";

mobileAds()
  .initialize()
  .then((adapterStatuses) => {
    // Initialization complete!
  });

const Index = () => {
  return (
    <SafeAreaView className="flex flex-1 items-center bg-dark-green justify-between">
      <StatusBar style="dark" />
      <Text className="text-white text-2xl pt-16 text-center font-bold px-4">
        Football Player Guessing Game
      </Text>
      <Image
        source={Images.Banner}
        style={{ width: 400, height: 400, borderRadius: 120 }}
      />
      {/* <View className="flex flex-col w-full items-center justify-center">
        <Text className="text-white text-center text-2xl font-bold px-24">
          Football Player Guessing Game
        </Text>
      </View> */}
      <Link href="/Filter" className="">
        <View className="flex flex-row items-center justify-center space-x-3 bg-light-green px-12 py-4 rounded-lg">
          <Text className="text-white font-bold text-2xl">Start Game</Text>
          <Ionicons name="play-circle-outline" size={28} color="white" />
        </View>
      </Link>

      <Text className="text-center text-light-gray text-sm pb-8">
        Developed by: <Text>eneserden</Text>
      </Text>
    </SafeAreaView>
  );
};

export default Index;
