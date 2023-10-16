import { Text, View } from "react-native";

import { Image } from "react-native";
import Images from "@/constants/Images";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";

const Index = () => {
  return (
    <View className="flex flex-1 items-center justify-center space-y-24 bg-slate-200 pt-24">
      <Image
        source={Images.Banner}
        style={{ width: 400, height: 400, borderRadius: 120 }}
      />
      {/* <View className="flex flex-col w-full items-center justify-center">
        <Text className="text-white text-center text-2xl font-bold px-24">
          Football Player Guessing Game
        </Text>
      </View> */}
      <Link href="/GuessPlayer" className="">
        <View className="flex flex-row items-center justify-center space-x-3 bg-green-600 px-12 py-4 rounded-lg">
          <Text className="text-white font-bold text-2xl">Start Game</Text>
          <Ionicons name="play-circle-outline" size={28} color="white" />
        </View>
      </Link>
      <View></View>
    </View>
  );
};

export default Index;
