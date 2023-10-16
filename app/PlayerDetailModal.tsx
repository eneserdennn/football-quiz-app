import { Image, Linking, Text, View } from "react-native";

import React from "react";
import { selectRandomPlayer } from "@/redux/features/randomPlayerSlice";
import { useSelector } from "react-redux";

const PlayerDetailModal = () => {
  const randomPlayer = useSelector(selectRandomPlayer);

  return (
    <View className="p-5 bg-gray-100">
      <Image
        source={{ uri: randomPlayer?.image_url }}
        className="w-24 h-24 rounded-full mx-auto"
      />
      <Text className="text-lg font-bold mt-3 text-center">
        {randomPlayer?.name}
      </Text>
      <View className="mt-5">
        <Text className="text-sm text-gray-600">
          Date of Birth: {randomPlayer?.date_of_birth}
        </Text>
        <Text className="text-sm text-gray-600">
          Birth Place: {randomPlayer?.birth_place}
        </Text>
        <Text className="text-sm text-gray-600">
          Nationality: {randomPlayer?.nationality}
        </Text>
        <Text className="text-sm text-gray-600">
          Height: {randomPlayer?.height}m
        </Text>
        <Text className="text-sm text-gray-600">
          League: {randomPlayer?.league}
        </Text>
        <Text className="text-sm text-gray-600">
          Current Club: {randomPlayer?.current_club_name}
        </Text>
        <Text className="text-sm text-gray-600">
          Foot: {randomPlayer?.foot}
        </Text>
        <Text className="text-sm text-gray-600">
          Position: {randomPlayer?.position}
        </Text>
        <Text className="text-sm text-gray-600">
          Joined Date: {randomPlayer?.joined_date}
        </Text>
        <Text className="text-sm text-gray-600">
          Contract End Date: {randomPlayer?.contract_end_date}
        </Text>
        <Text className="text-sm text-gray-600">
          Outfitter: {randomPlayer?.outfitter}
        </Text>
        <Text className="text-sm text-gray-600">
          Market Value: ${randomPlayer?.market_value}
        </Text>
      </View>

      <Text className="mt-3 text-sm font-semibold text-gray-700">
        Social Media:
      </Text>
      {randomPlayer?.social_media.map((link, index) => (
        <Text
          key={index}
          className="text-blue-500 underline mt-1"
          onPress={() => Linking.openURL(link)}
        >
          {link}
        </Text>
      ))}
    </View>
  );
};

export default PlayerDetailModal;
