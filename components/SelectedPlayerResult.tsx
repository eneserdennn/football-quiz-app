import {
  Animated,
  Easing,
  ImageBackground,
  ImageStyle,
  Text,
  View,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  setPlayerAge,
  setPlayerClub,
  setPlayerClubImage,
  setPlayerCountry,
  setPlayerLeague,
  setPlayerPosition,
  setPlayerValue,
} from "@/redux/features/player/playerFindSlice";

import { Image } from "expo-image";
import Images from "@/constants/Images";
import codes from "@/codes.json";
import { setAnimationFinished } from "@/redux/features/animationSlice";
import { setIsFinded } from "@/redux/features/player/playerFindSlice";
import { useDispatch } from "react-redux";
import { useGetLeaguesQuery } from "@/redux/api/apiSlice";

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

interface PlayerInfoProps {
  match: boolean;
  title: string;
  data: string | JSX.Element;
  icon?: JSX.Element | null;
  delay?: number; // <-- Add delay prop
  onAnimationFinish?: () => void; // Add this line
}

const formatMarketValue = (value: number): string => {
  if (value >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(0)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)} K`;
  }
  return value.toString();
};

const getMarketValueHintIcon = (selectedValue: number, playerValue: number) => {
  if (selectedValue < playerValue) {
    return <FontAwesome name="arrow-up" size={16} />;
  } else if (selectedValue > playerValue) {
    return <FontAwesome name="arrow-down" size={16} />;
  }
  return null;
};

const getCountryCode = (nationality: string): string | null => {
  const entry = Object.entries(codes).find(([, name]) => name === nationality);

  if (nationality === "Korea, South") return "kr";

  return entry ? entry[0] : null;
};

const calculateAge = (birthday: string): number => {
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

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

const imageStyle: ImageStyle = {
  width: 38,
  height: 24,
};

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  match,
  title,
  data,
  icon,
  delay = 0,
  onAnimationFinish,
}) => {
  const dispatch = useDispatch();
  // const opacity = useRef(new Value(0)).current;

  // useEffect(() => {
  //   timing(opacity, {
  //     toValue: 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //     easing: Easing.inOut(Easing.quad),
  //     delay: delay,
  //   }).start(() => {
  //     if (match) {
  //       onAnimationFinish?.(); // Call the callback here
  //     }
  //   });
  // }, []);

  const backgroundColor = match ? "bg-green-600" : "bg-gray-600";

  return (
    <View className="flex items-center">
      <View
        // style={{ opacity }}
        className={`flex items-center p-0.5 rounded-full ${backgroundColor} shadow-md`}
      >
        <View className="h-14 bg-white items-center justify-center rounded-full shadow-md">
          <View className="bg-white h-14 w-14 rounded-full items-center justify-center">
            {typeof data === "string" ? (
              <Text className="font-semibold text-center">{data}</Text>
            ) : (
              data
            )}
            {icon}
          </View>
          {match && (
            <View className="absolute bottom-[-10px] bg-white rounded-full h-5 w-5 border border-green-700 items-center justify-center">
              <FontAwesome5 name="check" size={12} color="green" />
            </View>
          )}
        </View>
      </View>
      <View className="flex items-center justify-center bg-slate-700 p-1 mt-2.5 rounded-full">
        <Text className="text-white text-xs px-1">{title}</Text>
      </View>
    </View>
  );
};

interface SelectedPlayerResultProps {
  selected: PlayerProfile;
  player: PlayerProfile;
}

const SelectedPlayerResult: React.FC<SelectedPlayerResultProps> = ({
  selected,
  player,
}) => {
  const [finishedAnimations, setFinishedAnimations] = useState<number>(0);
  const { data, isLoading } = useGetLeaguesQuery({});
  const [teamLogo, setTeamLogo] = useState<string>("");
  const dispatch = useDispatch();

  const teamName = selected.current_club_name
    .toLocaleLowerCase()
    .replace(" ", "-");

  useEffect(() => {
    const totalMatches = 6;
    if (finishedAnimations === totalMatches) {
      dispatch(setAnimationFinished(true));
    }
  }, [finishedAnimations]);

  useEffect(() => {
    if (player.name === selected.name) {
      dispatch(setIsFinded(true));

    }
  }, [selected]);

  useEffect(() => {
    if (data) {
      if (selected.league === "LaLiga") {
        const leagueData = data.find(
          (league: any) => league.league_name === "La Liga"
        );
        const teamLogoURL = leagueData?.teams.find((team: any) =>
          team.team_name.includes(teamName)
        )?.team_logo;
        setTeamLogo(teamLogoURL);
        dispatch(setPlayerClubImage(teamLogoURL));

      } else {
        const leagueData = data.find(
          (league: any) => league.league_name === selected.league
        );

        const teamLogoURL = leagueData?.teams.find((team: any) =>
          team.team_name.includes(teamName)
        )?.team_logo;
        setTeamLogo(teamLogoURL);
        dispatch(setPlayerClubImage(teamLogoURL));
      }
    }
  }, [data, teamName]);

  useEffect(() => {
    if (selected.league === player.league) {
      dispatch(setPlayerLeague(selected.league));
    }
    if (selected.current_club_name === player.current_club_name) {
      dispatch(setPlayerClub(selected.current_club_name));
    }
    if (getPosition(selected.position) === getPosition(player.position)) {
      dispatch(setPlayerPosition(getPosition(selected.position)));
    }
    if (selected.market_value === player.market_value) {
      dispatch(setPlayerValue(selected.market_value));
    }
    if (selected.nationality == player.nationality) {
      dispatch(setPlayerCountry(selected.nationality));
    }
  }, [selected]);

  return (
    <View className={`flex bg-white  p-2 my-1 shadow-sm rounded-2xl`}>
      <View className="flex flex-row justify-center">
        <Text className={`text-center text-lg p-1 font-bold`}>
          {selected.name.toUpperCase()}
        </Text>
      </View>
      <View className="flex flex-row justify-between">
        <PlayerInfo
          delay={300}
          onAnimationFinish={() => {
            setFinishedAnimations((prev) => prev + 1);
          }}
          match={selected.nationality === player.nationality}
          title="Country"
          data={
            <Image
              source={{
                uri: `https://flagcdn.com/w160/${getCountryCode(
                  selected.nationality
                )}.jpg`,
              }}
              style={imageStyle}
              contentFit="cover"
              transition={1000}
            />
          }
        />
        {teamLogo && (
          <PlayerInfo
            delay={600}
            onAnimationFinish={() => {
              setFinishedAnimations((prev) => prev + 1);
            }}
            match={selected.current_club_name === player.current_club_name}
            title="Club"
            data={
              <Image
                source={{
                  uri: teamLogo,
                }}
                style={{
                  width: 40,
                  height: 45,
                }}
                contentFit="contain"
                transition={1000}
              />
            }
          />
        )}
        {!teamLogo && (
          <PlayerInfo
            delay={900}
            onAnimationFinish={() => {
              setFinishedAnimations((prev) => prev + 1);
            }}
            match={selected.current_club_name === player.current_club_name}
            title="Club"
            data={selected.current_club_name}
          />
        )}
        <PlayerInfo
          delay={1200}
          onAnimationFinish={() => {
            setFinishedAnimations((prev) => prev + 1);
          }}
          match={
            getPosition(selected.position) === getPosition(player.position)
          }
          title="Position"
          data={getPosition(selected.position)}
        />
        <PlayerInfo
          delay={1500}
          onAnimationFinish={() => {
            setFinishedAnimations((prev) => prev + 1);
          }}
          match={
            calculateAge(selected.date_of_birth) ===
            calculateAge(player.date_of_birth)
          }
          title="Age"
          data={String(calculateAge(selected.date_of_birth))}
          icon={
            calculateAge(selected.date_of_birth) ===
            calculateAge(player.date_of_birth) ? null : (
              <FontAwesome
                name={`arrow-${
                  calculateAge(selected.date_of_birth) >
                  calculateAge(player.date_of_birth)
                    ? "down"
                    : "up"
                }`}
                size={16}
              />
            )
          }
        />
        <PlayerInfo
          delay={1800}
          onAnimationFinish={() => {
            setFinishedAnimations((prev) => prev + 1);
          }}
          match={selected.market_value === player.market_value}
          title="Value"
          data={formatMarketValue(selected.market_value)}
          icon={getMarketValueHintIcon(
            selected.market_value,
            player.market_value
          )}
        />
      </View>
      {/* <View className="flex flex-row justify-evenly">
        <Text
          className={`text-center m-1 p-1 font-bold ${
            selected.league === player.league ? "text-green-400" : "text-white"
          }`}
        >
          {selected.name}
        </Text>
      </View> */}
    </View>
  );
};

export default SelectedPlayerResult;
