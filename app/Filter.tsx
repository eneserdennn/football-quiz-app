import React, { useState } from 'react';
import {Button, SafeAreaView, Text, View, StyleSheet, Pressable} from 'react-native';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import { setMaxMarketValue, setMinMarketValue, setLeague } from '@/redux/features/filter/filterSlice';
import { RootState } from '@/redux/store';
import {router} from "expo-router";



const FilterScreen = () => {
    const dispatch = useDispatch();
    const minMarketValue = useSelector((state: RootState) => state.filter.minMarketValue);
    const maxMarketValue = useSelector((state: RootState) => state.filter.maxMarketValue);
    const league = useSelector((state: RootState) => state.filter.league);
    const [localMinMarketValue, setLocalMinMarketValue] = useState(minMarketValue);
    const [localMaxMarketValue, setLocalMaxMarketValue] = useState(maxMarketValue);

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
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>
                You can filter players by using the following options:
            </Text>

            <View style={styles.sliderContainer}>
                <Text style={styles.label}>
                    Minimum Market Value: {formatValue(localMinMarketValue)}
                </Text>
                <Slider
                    style={styles.slider}
                    minimumValue={100000}
                    maximumValue={localMaxMarketValue - 1000000}
                    value={localMinMarketValue}
                    onValueChange={value => setLocalMinMarketValue(value)}
                    step={100000}
                />

                <Text style={styles.label}>
                    Maximum Market Value: {formatValue(localMaxMarketValue)}
                </Text>
                <Slider
                    style={styles.slider}
                    minimumValue={localMinMarketValue + 1000000}
                    maximumValue={200000000}
                    value={localMaxMarketValue}
                    onValueChange={value => setLocalMaxMarketValue(value)}
                    step={100000}
                />
            </View>

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

            {/*<Picker*/}
            {/*    selectedValue={league}*/}
            {/*    style={{*/}
            {/*        borderWidth: 1,*/}
            {/*        borderColor: "gray",*/}
            {/*        padding: 10,*/}
            {/*        marginVertical: 10,*/}
            {/*        marginHorizontal: 10,*/}
            {/*        borderRadius: 10,*/}
            {/*    }}*/}
            {/*    onValueChange={(itemValue) => dispatch(setLeague(itemValue))}*/}
            {/*>*/}
            {/*    <Picker.Item label="Premier League" value="Premier League" />*/}
            {/*    <Picker.Item label="Serie A" value="Serie A" />*/}
            {/*    <Picker.Item label="La Liga" value="La Liga" />*/}
            {/*    <Picker.Item label="Bundesliga" value="Bundesliga" />*/}
            {/*    <Picker.Item label="Ligue 1" value="Ligue 1" />*/}

            {/*</Picker>*/}


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
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 30,
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
