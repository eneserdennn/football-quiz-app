import {
    AdEventType,
    InterstitialAd,
    BannerAd, BannerAdSize,
    RewardedAd, RewardedAdEventType,
    TestIds,
} from "react-native-google-mobile-ads";

import {
    FlatList,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
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
import React, {useEffect, useRef, useState} from "react";
import {
    useGetAllPlayersQuery,
    useGetRandomPlayerQuery,
} from "@/redux/api/apiSlice";

import {Image} from "expo-image";
import {ImageBackground} from "expo-image";
import {Images} from "@/constants/Images";
import LottieView from "lottie-react-native";
import {RootState} from "@/redux/store";
import {SafeAreaView} from "react-native-safe-area-context";
import SelectedPlayerResult from "@/components/SelectedPlayerResult";
import {StatusBar} from "expo-status-bar";
import {StyleSheet} from "react-native";
import codes from "@/codes.json";
import {router} from "expo-router";
import {setRandomPlayer} from "@/redux/features/randomPlayerSlice";


//IOS
// const adUnitId = __DEV__
//     ? TestIds.INTERSTITIAL
//     : "ca-app-pub-2873161513297667/1759910432";

//Android
const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-2873161513297667/9652511192";

//IOS
// const reawardedAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2873161513297667/7032482052';

//Android
const reawardedAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2873161513297667/8455081225';

//IOS
// const bannerAdUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2873161513297667/7022224837';

//Android
const bannerAdUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2873161513297667/1506529498';


const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    keywords: ["football", "quiz", "soccer", "player", "guess"],
});

const rewarded = RewardedAd.createForAdRequest(reawardedAdUnitId, {
    keywords: ["football", "quiz", "soccer", "player", "guess"],
});


interface PlayerProfile {
    id: string;
    shirt_number: number;
    name: string;
    dateOfBirth: string;
    birthCountry: string;
    nationality: string;
    height: number;
    // league: string;
    // current_club_name: string;
    image_url: string;
    full_name: string;
    foot: string;
    position: string;
    // joined_date: string;
    // contract_end_date: string;
    // last_contract_extension_date: string;
    // social_media: string[];
    market_value: number;
    // transfer_history: Transfer[];
    // outfitter: string;
    playerTeamId: number;
    playerTeam: PlayerTeam;
}

interface PlayerTeam {
    "id": number,
    "name": string
    "averageMarketValue": number;
    "averageAge": number;
    "totalMarketValue": number;
    "leagueId": number;
    "league": League;
}

interface League {
    "id": number,
    "name": string,
    "totalMarketValue": number,
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
    const [loaded, setLoaded] = useState(false);
    const [isGiveUp, setIsGiveUp] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState("");


    //////////////REWARDED AD/////////////////////
    const [loadedReward, setLoadedReward] = useState(false);
    const [isRewarded, setIsRewarded] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState('');
    const [isPosition, setIsPosition] = useState(false);
    const [isClub, setIsClub] = useState(false);
    const [isCountry, setIsCountry] = useState(false);
    //////////////////////////////////////////////

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

    const minMarketValue = useSelector(
        (state: RootState) => state.filter.minMarketValue
    );
    const maxMarketValue = useSelector(
        (state: RootState) => state.filter.maxMarketValue
    );
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

    const reloadInterstitial = () => {
        const unsubscribe = interstitial.addAdEventListener(
            AdEventType.LOADED,
            () => {
                setLoaded(true);
            }
        );
        // Start loading the interstitial straight away
        interstitial.load();

        // Unsubscribe from events on unmount
        return unsubscribe;
    };

    useEffect(() => {
        if (data?.randomPlayer) {
            dispatch(setRandomPlayer(data?.randomPlayer));
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [league, minMarketValue, maxMarketValue]);

    useEffect(() => {

    }, []);

    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(
            AdEventType.LOADED,
            () => {
                setLoaded(true);
            }
        );
        // Start loading the interstitial straight away
        interstitial.load();
        // Unsubscribe from events on unmount
        return unsubscribe;
        reloadInterstitial();
    }, []);

    ////////////////////////////REWARDED AD//////////////////////////////
    useEffect(() => {
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setLoadedReward(true);
        });

        const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
                console.log('User earned reward of ', reward);
                setIsRewarded(true);
            },
        );

        rewarded.load();

        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
        };
    }, []);

    const handleInfoClick = (info: string) => {
        setSelectedInfo(info);


        try {
            if (loadedReward) {
                rewarded.show();
                switch (info) {
                    case 'club':
                        setIsClub(true);
                        break;
                    case 'country':
                        setIsCountry(true);
                        break;
                    case 'position':
                        setIsPosition(true);
                        break;
                }
                setLoadedReward(false)
            } else {
                console.log('Ad not loaded yet');
                setLoadedReward(false);
            }
        } catch (e) {
            setLoadedReward(false);
            console.log(e);
        }

        // if (loadedReward) {
        //     rewarded.show();
        // } else {
        //     console.log('Ad not loaded yet');
        //     setLoadedReward(false);
        //
        // }

    };
    /////////////////////////////////////////////

    useEffect(() => {
        if (data) {
            const getPosition = (position: string | undefined): string => {
                if (!position) return "N/A";

                switch (position) {
                    case "midfield - Attacking Midfield":
                        return "AT";
                    case "midfield - Defensive Midfield":
                        return "MF";
                    case "midfield - Central Midfield":
                        return "MF";
                    case "midfield - Left Midfield":
                        return "MF";
                    case "midfield - Right Midfield":
                        return "MF";
                    case "midfield - Left Wing":
                        return "LW";
                    case "midfield - Right Wing":
                        return "RW";
                    default:
                        break;
                }

                switch (position.split(" ")[0]) {
                    case "Goalkeeper":
                        return "GK";
                    case "Defender":
                        return "DF";
                    case "Midfielder":
                        return "MF";
                    case "midfield":
                        return "MF";
                    case "Attack":
                        return "AT";
                    default:
                        return "N/A";
                }
            };


            setSelectedPosition(getPosition(data?.randomPlayer?.position));
        }
    }, [data]);

    const {
        data: allPlayers,
        error: allPlayersError,
        isLoading: allPlayersLoading,
    } = useGetAllPlayersQuery({});

    if (isLoading || allPlayersLoading || isFetching) {
        return (
            <View className="flex flex-1 flex-col bg-dark-green items-center justify-center pt-24">
                <Text className="text-3xl font-bold text-light-gray">
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
        try {
            if (loaded) {
                interstitial.show();
            }
        } catch (e) {
            console.log(e);
        }
        return (
            <ScrollView className="flex flex-1 pt-16 bg-dark-green">
                <View className="flex items-center p-4 bg-light-gray m-4 rounded-lg">
                    <Text className="text-3xl font-bold text-rose-600">Game over!</Text>
                    <Text className="text-lg font-semibold text-gray-600 text-center">
                        {isGiveUp ? "You gave up! The player was:" : "You have reached the maximum number of tries. The correct answer is:"}
                    </Text>
                    <Text className="text-3xl font-bold">{data?.randomPlayer?.name}</Text>
                </View>

                <View className="flex mx-4 mb-2">
                    <SelectedPlayerResult
                        selected={data?.randomPlayer}
                        player={data?.randomPlayer}
                    />
                </View>

                <View className="mt-10">
                    {bannerAdUnitId && (
                        <BannerAd
                            unitId={bannerAdUnitId}
                            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        />
                    )}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        refetch();
                        setAttempts(0);
                        setSelectedPlayers([]);
                        setIsCorrect(false);
                        setIsGiveUp(false);
                        dispatch(setIsFinded(false));
                        dispatch(setPlayerClub(""));
                        dispatch(setPlayerClubImage(""));
                        dispatch(setPlayerCountry(""));
                        dispatch(setPlayerPosition(""));
                        dispatch(setPlayerLeague(""));
                        setIsRewarded(false);
                        reloadInterstitial();
                    }}
                    className="bg-green-600 p-4 rounded-lg m-4 mt-10"
                >
                    <Text className="text-white font-semibold text-center">
                        Play again
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        );
    }

    if (isFinded && attempts <= MAX_TRIES) {
        try {
            if (loaded) {
                interstitial.show();
            }
        } catch (e) {
            console.log(e);
        }
        return (
            <ScrollView className="flex flex-1 bg-dark-green pt-16">
                <View className="flex items-center space-y-4 p-4 bg-[#DDE6ED] m-4 rounded-lg">
                    <Text className="text-3xl font-bold text-light-green">Correct!</Text>
                    <Text className="text-lg font-semibold text-gray-600 text-center">
                        {attempts === 0 ? "You got it on the first try!" : `It took you ${attempts} tries.`}
                    </Text>
                    <Text className="text-3xl font-bold">{data?.randomPlayer?.name}</Text>
                </View>
                <View className="flex mx-4">
                    <SelectedPlayerResult
                        selected={data?.randomPlayer}
                        player={data?.randomPlayer}
                    />
                </View>

                <View className="mt-10">
                    {bannerAdUnitId && (
                        <BannerAd
                            unitId={bannerAdUnitId}
                            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        />
                    )}
                </View>

                <TouchableOpacity
                    onPress={() => {
                        refetch();
                        setAttempts(0);
                        setSelectedPlayers([]);
                        setIsCorrect(false);
                        setIsGiveUp(false);
                        setIsRewarded(false);
                        dispatch(setIsFinded(false));
                        dispatch(setPlayerClub(""));
                        dispatch(setPlayerClubImage(""));
                        dispatch(setPlayerCountry(""));
                        dispatch(setPlayerPosition(""));
                        dispatch(setPlayerLeague(""));
                        reloadInterstitial();
                    }}
                    className="bg-light-green p-4 rounded-lg m-4 mt-16"
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
            <View className="flex flex-1 flex-col bg-dark-green items-center justify-center pt-24">
                <Text className="text-3xl font-bold text-light-gray">
                    We couldn't find a player with these filters.
                </Text>
                <Pressable
                    onPress={() => {
                        router.back();
                    }}
                    className="bg-light-green p-2 rounded-lg m-4"
                >
                    <Text className="text-white font-semibold text-center">
                        Go back and change filters
                    </Text>
                </Pressable>
            </View>
        );
    }

    console.log(playerCountry);

    return (
        <SafeAreaView className="flex-1 bg-dark-green">
            <StatusBar style="light"/>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                    marginHorizontal: 10,
                    marginVertical: 10,

                }}
            >
                <View className="flex flex-row items-center h-[30px] w-[60px] ">
                    <MaterialIcons
                        name={"arrow-back-ios"}
                        size={24}
                        color="white"
                        onPress={() => {
                            router.back();
                        }}
                    />
                </View>
                <Text className="text-white text-2xl font-bold">
                    Guess the Player
                </Text>
                <View className="flex flex-col items-center h-[36px] w-[60px] justify-center">
                    <FontAwesome
                        name="refresh"
                        size={24}
                        color="white"
                        onPress={() => {
                            // refetch();
                            setAttempts(7);
                            setIsGiveUp(true);
                            // setSelectedPlayers([]);
                            // setIsCorrect(false);
                            // dispatch(setIsFinded(false));
                            // dispatch(setPlayerClub(""));
                            // dispatch(setPlayerClubImage(""));
                            // dispatch(setPlayerCountry(""));
                            // // dispatch(setPlayerPosition(""));
                            // // dispatch(setPlayerLeague(""));
                        }}
                    />
                    <Text className="text font-semibold text-center text-light-gray">
                        Give up
                    </Text>
                </View>
            </View>
            <TextInput
                className="border bg-light-gray"
                placeholder="Search for the player"
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
                <View
                    style={{
                        position: "absolute",
                        top: 170,
                        left: 10,
                        right: 10,
                        zIndex: 1,
                        borderRadius: 5,
                        shadowOpacity: 0.6,
                        shadowRadius: 3,
                        shadowColor: "black",
                        shadowOffset: {width: 0, height: 2},
                    }}
                >
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
                                    if (data?.randomPlayer.id === item.id) {
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
                                    zIndex: 1000,
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
            <View className="relative flex-col items-center justify-center rounded-md mx-4">
                {playerClub !== "" || isRewarded && isClub ? (
                    <View
                        className="absolute flex items-center shadow-2xl justify-center border-2 border-light-gray bg-light-green rounded-full h-16 w-16 top-6 right-2">
                        {data?.randomPlayer?.playerTeam?.name.length > 6 ? (
                            <Text className="text-white text-xs text-center">
                                {data?.randomPlayer?.playerTeam?.name}
                            </Text>
                        ) : (
                            <Text className="text-white text-center">
                                {data?.randomPlayer?.playerTeam?.name}
                            </Text>
                        )}
                    </View>
                ) : (
                    <View
                        className="absolute flex items-center shadow-2xl justify-center rounded-full h-16 w-16 top-6 right-2">
                        <Text className="text-white text-[32px] font-bold">
                            <TouchableOpacity onPress={() => handleInfoClick('club')}>
                                <Image
                                    source={Images.RewardedImage}
                                    style={{
                                        width: 64,
                                        height: 64,
                                    }}
                                    contentFit="cover"
                                    transition={1000}
                                    className={`${loadedReward ? '' : 'opacity-25'}`}
                                />
                            </TouchableOpacity>
                        </Text>
                        <View className="flex items-center justify-center bg-slate-700 p-1 mt- rounded-full">
                            <Text className="text-white text-xs px-1">
                                Club
                            </Text>
                        </View>
                    </View>
                )}
                <View
                    className="absolute flex items-center shadow-2xl justify-center bg-white rounded-full h-[64px] w-[64px] bottom-0 right-2">
                    <Text className=" text-center  font-bold">
                        {MAX_TRIES - attempts} {"\n"}{" "}
                        {MAX_TRIES - attempts === 1 ? "Try" : "Tries"}
                    </Text>
                </View>
                {playerCountry !== "" || isRewarded && isCountry ? (
                    <View
                        className="absolute flex items-center shadow-2xl justify-center border-2 border-light-gray bg-light-green rounded-full h-16 w-16 bottom-6 left-2">
                        <Image
                            source={{
                                uri: `https://flagcdn.com/w160/${getCountryCode(
                                    data?.randomPlayer?.nationality
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
                        className="absolute flex items-center shadow-2xl justify-center rounded-full h-16 w-16 bottom-0 left-2">
                        <Text className="text-white text-[32px] font-bold">
                            <TouchableOpacity onPress={() => handleInfoClick('country')}>
                                <Image
                                    source={Images.RewardedImage}
                                    style={{
                                        width: 64,
                                        height: 64,
                                    }}
                                    contentFit="cover"
                                    transition={1000}
                                    className={`${loadedReward ? '' : 'opacity-25'}`}
                                />
                            </TouchableOpacity>
                        </Text>
                        <View className="flex items-center justify-center bg-slate-700 p-1 mt- rounded-full">
                            <Text className="text-white text-xs px-1">
                                Country
                            </Text>
                        </View>
                    </View>
                )}
                {playerPosition !== "" || isRewarded && isPosition ? (
                    <View
                        className="absolute flex items-center shadow-2xl  justify-center border-2 border-light-gray bg-light-green rounded-full h-16 w-16 top-6 left-2">
                        <Text className="text-white font-bold">{selectedPosition}</Text>
                    </View>
                ) : (
                    <View
                        className="absolute flex items-center shadow-2xl justify-center rounded-full h-16 w-16 top-6 left-2">
                        <Text className="text-white text-[32px] font-bold">
                            <TouchableOpacity onPress={() => handleInfoClick('position')}>
                                <Image
                                    source={Images.RewardedImage}
                                    style={{
                                        width: 64,
                                        height: 64,
                                    }}
                                    contentFit="cover"
                                    transition={1000}
                                    className={`${loadedReward ? '' : 'opacity-25'}`}
                                />
                            </TouchableOpacity>

                        </Text>
                        <View className="flex items-center justify-center bg-slate-700 p-1 mt- rounded-full">
                            <Text className="text-white text-xs px-1">
                                Position
                            </Text>
                        </View>
                    </View>
                )}

                {isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    <View className="p-1 bg-white rounded-full shadow-2xl">
                        {data?.randomPlayer?.image_url && showPhoto ? (
                            <ImageBackground
                                source={Images.ImageBg}
                                style={{
                                    width: 200,
                                    height: 200,
                                }}
                                imageStyle={{
                                    borderRadius: 120,
                                }}
                            >
                                <Image
                                    source={{
                                        uri:
                                            "http://api.eneserden.com/api/images/" +
                                            data?.randomPlayer?.playerTeam?.league?.name
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
                                        width: 200,
                                        height: 200,
                                        borderWidth: 2,
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
                        ) : (
                            <View
                                className="flex items-center justify-center bg-light-gray rounded-full"
                                style={{
                                    width: 200,
                                    height: 200,
                                }}
                            >
                                <Text className="text-3xl font-bold text-light-gray">
                                    Image not found
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
            {isCorrect && (
                <View>
                    <Text>Correct!</Text>
                    <Text>It took you {attempts} tries.</Text>
                    <Text>{data?.randomPlayer?.name}</Text>
                </View>
            )}

            <ScrollView className="flex px-8 mx-2 mt-4 border-t-2 border-gray-300">
                {selectedPlayers.map((player, index) => (
                    <SelectedPlayerResult
                        key={index}
                        selected={player}
                        player={data?.randomPlayer}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
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
    },
});
