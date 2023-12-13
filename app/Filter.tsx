import {
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  setLeague,
  setMaxMarketValue,
  setMinMarketValue,
} from "@/redux/features/filter/filterSlice";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";

const FilterScreen = () => {
  const dispatch = useDispatch();
  const minMarketValue = useSelector(
    (state: RootState) => state.filter.minMarketValue
  );
  const maxMarketValue = useSelector(
    (state: RootState) => state.filter.maxMarketValue
  );
  const league = useSelector((state: RootState) => state.filter.league);
  const [localMinMarketValue, setLocalMinMarketValue] =
    useState(minMarketValue);
  const [localMaxMarketValue, setLocalMaxMarketValue] =
    useState(maxMarketValue);

  const leagues = [
    "Premier League",
    "Serie A",
    "La Liga",
    "Bundesliga",
    "Ligue 1",
  ];
  const handleSubmit = () => {
    dispatch(setMinMarketValue(localMinMarketValue));
    dispatch(setMaxMarketValue(localMaxMarketValue));

    router.push("/GuessPlayer");
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M €`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K €`;
    }
    return value.toString();
  };

  return (
    <SafeAreaView style={styles.container} className="bg-dark-green">
      <View style={styles.sliderContainer}>
        <Text style={styles.headerText} className="text-light-gray">
          You can filter players by using the following options:
        </Text>
        <Text style={styles.label} className="text-light-gray">
          Minimum Market Value: {formatValue(localMinMarketValue)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={100000}
          maximumValue={localMaxMarketValue - 1000000}
          value={localMinMarketValue}
          onValueChange={(value) => setLocalMinMarketValue(value)}
          step={100000}
        />

        <Text style={styles.label} className="text-light-gray">
          Maximum Market Value: {formatValue(localMaxMarketValue)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={localMinMarketValue + 1000000}
          maximumValue={200000000}
          value={localMaxMarketValue}
          onValueChange={(value) => setLocalMaxMarketValue(value)}
          step={100000}
        />
        <View style={{ marginVertical: 10 }}>
          {leagues.map((item, index) => (
            <View key={index}>
              <Pressable
                onPress={() => dispatch(setLeague(item))}
                style={{
                  backgroundColor: league === item ? "#4CAF50" : "#DDDDDD",
                  padding: 10,
                  marginVertical: 5,
                  marginHorizontal: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center" }}>{item}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        style={{
          backgroundColor: "#4CAF50",
          padding: 20,
          marginVertical: 10,
          marginHorizontal: 10,
          borderRadius: 10,
        }}
        onPress={handleSubmit}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Search</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    marginTop: 50,
  },
  sliderContainer: {
    margin: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  slider: {
    height: 40,
  },
});

export default FilterScreen;
