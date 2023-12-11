import {
    Button,
    FlatList,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Picker } from '@react-native-picker/picker';

import {
    selectIsFinded,
    selectPlayerClub,
    selectPlayerClubImage,
    selectPlayerCountry,
    selectPlayerLeague,
    selectPlayerPosition,
    setIsFinded,
    setPlayerClub,
    setPlayerClubImage,
    setPlayerCountry,
    setPlayerLeague,
    setPlayerPosition,
} from "@/redux/features/player/playerFindSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {
    useGetAllPlayersQuery,
    useGetRandomPlayerQuery,
} from "@/redux/api/apiSlice";

import {FontAwesome, FontAwesome5, MaterialIcons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {ImageBackground} from "expo-image";
import {Images} from "@/constants/Images";
import {Link} from "expo-router";
import LottieView from "lottie-react-native";
import SelectedPlayerResult from "@/components/SelectedPlayerResult";
import {StyleSheet} from "react-native";
import codes from "@/codes.json";
import {selectAnimationFinished} from "@/redux/features/animationSlice";
import {setRandomPlayer} from "@/redux/features/randomPlayerSlice";
import {StatusBar} from "expo-status-bar";
import {router} from 'expo-router';
import {RootState} from "@/redux/store";


interface PlayerProfile {
    _id: string;
    shirt_number: number;
    name: string;
    date_of_birth: string;
    birth_place: string;
    nationality: string;
    height: number;
    league: string;
    current_club_name: string;
    image_url: string;
    full_name_in_home_country: string;
    foot: string;
    position: string;
    joined_date: string;
    contract_end_date: string;
    last_contract_extension_date: string;
    social_media: string[];
    market_value: number;
    transfer_history: Transfer[];
    outfitter: string;
}

interface Transfer {
    _id: string;
    season: string;
    date: string;
    old_club: string;
    new_club: string;
    transfer_market_value: number | null;
    fee: string | null;
}

const MAX_TRIES = 7;


const GuessPlayer = () => {
    const dispatch = useDispatch();
    const [isFiltered, setIsFiltered] = useState(true);
    const [showPhoto, setShowPhoto] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [value, setValue] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerProfile[]>([]);
    const animation = useRef(null);
    const animationFinished = useSelector(selectAnimationFinished);

    // Dropdown
    const [inputValue, setInputValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const playerClub = useSelector(selectPlayerClub);
    const playerLeague = useSelector(selectPlayerLeague);
    const playerCountry = useSelector(selectPlayerCountry);
    const playerPosition = useSelector(selectPlayerPosition);
    const playerClubImage = useSelector(selectPlayerClubImage);
    const isFinded = useSelector(selectIsFinded);
    const [selectedItem, setSelectedItem] = useState(null);

    const minMarketValue = useSelector((state: RootState) => state.filter.minMarketValue);
    const maxMarketValue = useSelector((state: RootState) => state.filter.maxMarketValue);
    const league = useSelector((state: RootState) => state.filter.league);

    const getCountryCode = (nationality: string): string | null => {
        const entry = Object.entries(codes).find(
            ([, name]) => name === nationality
        );

        if (nationality === "Korea, South") return "kr";

        return entry ? entry[0] : null;
    };

    const {data, error, isLoading, refetch, isFetching} =
        useGetRandomPlayerQuery({
            minMarketValue,
            maxMarketValue,
            league,
        });

    useEffect(() => {
        if (data?.randomPlayer) {
            dispatch(setRandomPlayer(data?.randomPlayer));
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [league, minMarketValue, maxMarketValue]);

    const {
        data: allPlayers,
        error: allPlayersError,
        isLoading: allPlayersLoading,
    } = useGetAllPlayersQuery({});


    if (isLoading || allPlayersLoading || isFetching) {
        return (
            <View className="flex flex-1 flex-col bg-slate-200 items-center justify-center pt-24">
                <Text className="text-3xl font-bold text-slate-700">
                    Finding a player...
                </Text>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 400,
                        height: 400,
                    }}
                    source={require("../assets/animations/loading.json")}
                />
            </View>
        );
    }

    if (error || allPlayersError) {
        return <Text>Error</Text>;
    }

    if (attempts >= MAX_TRIES && !isCorrect) {
        return (
            <ScrollView className="flex flex-1 pt-16 bg-[#27374D]">
                <View className="flex flex-col items-center justify-center rounded-md ">
                    <Image
                        source={{
                            uri:
                                "http://api.eneserden.com/api/images/" +
                                data?.randomPlayer?.league.toLowerCase().replace(" ", "-") +
                                "/" +
                                data?.randomPlayer?.name.toLowerCase().replace(" ", "-") +
                                ".jpg",
                        }}
                        style={{
                            width: 200,
                            height: 200,
                        }}
                        contentFit="cover"
                        className="rounded-md "
                        transition={1000}
                    />
                </View>
                <View className="flex items-center p-4 bg-[#DDE6ED] m-4 rounded-lg">
                    <Text className="text-3xl font-bold text-rose-600">Game over!</Text>
                    <Text className="text-2xl font-semibold text-gray-600 text-center">
                        You have reached the maximum number of tries. The correct answer is:
                    </Text>
                    <Text className="text-3xl font-bold">{data?.randomPlayer?.name}</Text>

                </View>

                <View className="flex mx-4">
                    <SelectedPlayerResult
                        selected={data?.randomPlayer}
                        player={data?.randomPlayer}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        refetch();
                        setAttempts(0);
                        setSelectedPlayers([]);
                        setIsCorrect(false);
                        dispatch(setIsFinded(false));
                        dispatch(setPlayerClub(""));
                        dispatch(setPlayerClubImage(""));
                        dispatch(setPlayerCountry(""));
                        dispatch(setPlayerPosition(""));
                        dispatch(setPlayerLeague(""));
                    }}
                    className="bg-green-600 p-4 rounded-lg m-4"
                >
                    <Text className="text-white font-semibold text-center">
                        Play again
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    if (isFinded && attempts <= MAX_TRIES) {
        return (
            <ScrollView className="flex flex-1 bg-[#27374D] pt-12">
                <View className="flex flex-col items-center justify-center pt-2 rounded-md ">
                    <Image
                        source={{
                            uri:
                                "http://api.eneserden.com/api/images/" +
                                data?.randomPlayer?.league.toLowerCase().replace(" ", "-") +
                                "/" +
                                data?.randomPlayer?.name.toLowerCase().replace(" ", "-") +
                                ".jpg",
                        }}
                        style={{
                            width: 200,
                            height: 200,
                        }}
                        contentFit="cover"
                        className="rounded-md "
                        transition={1000}
                    />
                </View>
                <View className="flex items-center space-y-4 p-4 bg-[#DDE6ED] m-4 rounded-lg">
                    <Text className="text-3xl font-bold text-green-600">Correct!</Text>
                    <Text className="text-2xl font-semibold text-gray-600 text-center">
                        {attempts === 0
                            ? "You got it on the first try!"
                            : `It took you ${attempts} tries.`}
                    </Text>
                    <Text className="text-3xl font-bold">{data?.randomPlayer?.name}</Text>
                    {/* <Link
            href={{
              pathname: "/PlayerDetailModal",
            }}
            className=" p-4 rounded-lg m-4"
          >
            <Text className="font-bold text-xl text-blue-600 text-center">
              Click here to learn more about{" "}
              <Text className="font-bold text-xl text-slate-700 text-center">
                {data?.randomPlayer?.name}
              </Text>
            </Text>
          </Link> */}
                </View>
                <SelectedPlayerResult
                    selected={data?.randomPlayer}
                    player={data?.randomPlayer}
                />
                <TouchableOpacity
                    onPress={() => {
                        refetch();
                        setAttempts(0);
                        setSelectedPlayers([]);
                        setIsCorrect(false);
                        dispatch(setIsFinded(false));
                        dispatch(setPlayerClub(""));
                        dispatch(setPlayerClubImage(""));
                        dispatch(setPlayerCountry(""));
                        dispatch(setPlayerPosition(""));
                        dispatch(setPlayerLeague(""));
                    }}
                    className="bg-green-600 p-4 rounded-lg m-4"
                >
                    <Text className="text-white font-semibold text-center">
                        Play again
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    const onChangeText = async (text: string) => {
        setInputValue(text);
        if (text.length === 0) {
            setFilteredData([]);
            return;
        }
        if (text.length > 2) {
            const result = allPlayers?.players?.filter((player: PlayerProfile) => {
                return player.name.toLowerCase().includes(text.toLowerCase());
            });
            if (result?.length > 0) {
                setFilteredData(result);

            }
        }
    };

    if (data?.randomPlayer === undefined) {
        return (
            <View className="flex flex-1 flex-col bg-slate-200 items-center justify-center pt-24">
                <Text className="text-3xl font-bold text-slate-700">
                    We couldn't find a player with these filters.
                </Text>
                <Pressable
                    onPress={() => {
                        router.back();
                    }}
                    className="bg-green-600 p-2 rounded-lg m-4"
                >
                    <Text className="text-white font-semibold text-center">
                        Go back and change filters
                    </Text>
                </Pressable>
            </View>


        )
    }

    return (
        <View className="flex-1 bg-slate-100 pt-8">
            <StatusBar style="dark"/>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
                marginHorizontal: 10,
                marginVertical: 10,
            }}>
                <MaterialIcons name={'arrow-back-ios'} size={24} color="black" onPress={() => {
                    router.back();
                }}/>
                <View className="flex flex-col items-center space-y-1">
                    <FontAwesome name="refresh" size={24} color="black"
                                 onPress={() => {
                                     refetch();
                                     setAttempts(0);
                                     setSelectedPlayers([]);
                                     setIsCorrect(false);
                                     dispatch(setIsFinded(false));
                                     dispatch(setPlayerClub(""));
                                     dispatch(setPlayerClubImage(""));
                                     dispatch(setPlayerCountry(""));
                                     dispatch(setPlayerPosition(""));
                                     dispatch(setPlayerLeague(""));
                                 }}
                    />
                    <Text>New Player</Text>
                </View>
            </View>
            <Text className="text font-semibold text-center text-[#27374D]">
                Search for the player
            </Text>
            <TextInput
                // placeholder="Search Player"
                style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 10,
                    marginVertical: 10,
                    marginHorizontal: 10,
                    borderRadius: 10,
                }}
                onChangeText={onChangeText}
                value={inputValue}
            />
            {filteredData.length > 0 && (
                <View style={{
                    position: 'absolute',
                    top: 180,
                    left: 10,
                    right: 10,
                    zIndex: 1,
                    borderRadius: 5,
                    shadowOpacity: 0.6,
                    shadowRadius: 3,
                    shadowColor: 'black',
                    shadowOffset: {width: 0, height: 2},
                }}>
                    <FlatList
                        data={filteredData}
                        style={{maxHeight: 300, backgroundColor: "white"}}
                        renderItem={({item}) => (
                            <Pressable
                                onPress={() => {
                                    setInputValue("");
                                    setFilteredData([]);
                                    setSelectedPlayers((prevPlayers) => [item, ...prevPlayers]);
                                    // @ts-ignore
                                    if (data?.randomPlayer._id === item._id) {
                                        setIsCorrect(true);
                                    } else {
                                        setIsCorrect(false);
                                        setAttempts((prev) => prev + 1);
                                    }
                                }}
                                style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderBottomWidth: 0.2,
                                    borderBottomColor: "#27374D",
                                    zIndex: 1000
                                }}
                            >
                                <Text>
                                    {
                                        // @ts-ignore
                                        item.name
                                    }
                                </Text>
                            </Pressable>
                        )}
                    />
                </View>
            )}
            <View className="relative flex-col items-center justify-center rounded-md">
                {playerClub !== "" ? (
                    <View
                        className="absolute flex items-center shadow-2xl shado justify-center bg-green-900 rounded-full h-16 w-16 top-6 right-2">
                        <Image
                            source={{
                                uri: playerClubImage,
                            }}
                            style={{
                                width: 50,
                                height: 50,
                            }}
                            contentFit="contain"
                            className="rounded-full"
                            transition={1000}
                        />
                    </View>
                ) : (
                    <View
                        className="absolute flex items-center shadow-2xl shado justify-center bg-black rounded-full h-16 w-16 top-6 right-2">
                        <Text className="text-white text-[32px] font-bold">?</Text>
                    </View>
                )}
                {playerLeague !== "" ? (
                    <View
                        className="absolute flex items-center shadow-2xl shado justify-center bg-green-900 rounded-full h-16 w-16 bottom-6 right-2">
                        <Text className="text-white text-center font-bold">
                            {playerLeague}
                        </Text>
                    </View>
                ) : (
                    <View
                        className="absolute flex items-center shadow-2xl shado justify-center bg-black rounded-full h-16 w-16 bottom-6 right-2">
                        <Text className="text-white text-[32px] font-bold">?</Text>
                    </View>
                )}
                {playerCountry !== "" ? (
                    <View
                        className="absolute flex items-center shadow-2xl shado justify-center bg-green-900 rounded-full h-16 w-16 bottom-6 left-2">
                        <Image
                            source={{
                                uri: `https://flagcdn.com/w160/${getCountryCode(
                                    playerCountry
                                )}.jpg`,
                            }}
                            style={{
                                width: 46,
                                height: 30,
                            }}
                            contentFit="cover"
                            transition={1000}
                        />
                    </View>
                ) : (
                    <View
                        className="absolute flex items-center shadow-2xl shado justify-center bg-black rounded-full h-16 w-16 bottom-6 left-2">
                        <Text className="text-white text-[32px] font-bold">?</Text>
                    </View>
                )}
                {playerPosition !== "" ? (
                    <View
                        className="absolute flex items-center shadow-2xl shado justify-center bg-green-900 rounded-full h-16 w-16 top-6 left-2">
                        <Text className="text-white font-bold">{playerPosition}</Text>
                    </View>
                ) : (
                    <View
                        className="absolute flex items-center shadow-2xl shado justify-center bg-black rounded-full h-16 w-16 top-6 left-2">
                        <Text className="text-white text-[32px] font-bold">?</Text>
                    </View>
                )}

                {isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    <View className="p-3 bg-white rounded-full shadow-2xl">
                        {/* {!showPhoto && (
              <TouchableOpacity
                onPress={() => {
                  setShowPhoto(true);
                }}
                className="bg-[#DDE6ED] p-4 rounded-lg"
              >
                <Text className="text-[#27374D] font-semibold text-center">
                  Show photo
                </Text>
              </TouchableOpacity>
            )} */}

                        {data?.randomPlayer?.image_url && showPhoto && (
                            <ImageBackground
                                source={Images.ImageBg}
                                style={{
                                    width: 250,
                                    height: 250,
                                }}
                                imageStyle={{
                                    borderRadius: 120,
                                }}
                            >
                                <Image
                                    source={{
                                        uri:
                                            "http://api.eneserden.com/api/images/" +
                                            data?.randomPlayer?.league
                                                .toLowerCase()
                                                .replace(" ", "-") +
                                            "/" +
                                            data?.randomPlayer?.name
                                                .toLowerCase()
                                                .replace(" ", "-") +
                                            ".jpg" ||
                                            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png",
                                    }}
                                    style={{
                                        width: 250,
                                        height: 250,
                                        borderWidth: 4,
                                    }}
                                    contentFit="contain"
                                    className="rounded-full"
                                    blurRadius={
                                        attempts === 0
                                            ? 60
                                            : attempts === 1
                                                ? 50
                                                : attempts === 2
                                                    ? 40
                                                    : attempts === 3
                                                        ? 30
                                                        : attempts === 4
                                                            ? 25
                                                            : attempts === 5
                                                                ? 20
                                                                : attempts === 6
                                                                    ? 15
                                                                    : 0
                                    }
                                    transition={1000}
                                />
                            </ImageBackground>

                        )}

                    </View>
                )}
            </View>

            {/*<Text className="text-3xl font-bold text-center text-[#27374D]">*/}
            {/*    {data?.randomPlayer?.name} ({data?.randomPlayer?.market_value/1000000}M €)*/}
            {/*    {league}*/}
            {/*</Text>*/}

            {isCorrect && (
                <View>
                    <Text>Correct!</Text>
                    <Text>It took you {attempts} tries.</Text>
                    <Text>{data?.randomPlayer?.name}</Text>
                </View>
            )}


            <ScrollView className="flex px-8">
                {selectedPlayers.map((player, index) => (
                    <SelectedPlayerResult
                        key={index}
                        selected={player}
                        player={data?.randomPlayer}
                    />
                ))}
            </ScrollView>

        </View>
    );
};

export default GuessPlayer;

const styles = StyleSheet.create({
    dropdown: {
        marginHorizontal: 12,
        marginVertical: 12,
        height: 50,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 24,
        borderWidth: 1,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 10,
        color: "#27374D",
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
        marginRight: 5,
        color: "#DDE6ED",
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: "#27374D",
    }
});
