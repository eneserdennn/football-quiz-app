import { createSlice } from "@reduxjs/toolkit";

interface PlayerFindState {
  playerLeague: string;
  playerCountry: string;
  playerClub: string;
  playerPosition: string;
  playerAge: number;
  playerValue: number;
  playerClubImage: string;
  isFinded: boolean;
}

const initialState: PlayerFindState = {
  playerLeague: "",
  playerCountry: "",
  playerClub: "",
  playerPosition: "",
  playerAge: 0,
  playerValue: 0,
  playerClubImage: "",
  isFinded: false,
};

const playerFindSlice = createSlice({
  name: "playerFind",
  initialState,
  reducers: {
    setPlayerLeague(state, action) {
      state.playerLeague = action.payload;
    },
    setPlayerCountry(state, action) {
      state.playerCountry = action.payload;
    },
    setPlayerClub(state, action) {
      state.playerClub = action.payload;
    },
    setPlayerPosition(state, action) {
      state.playerPosition = action.payload;
    },
    setPlayerAge(state, action) {
      state.playerAge = action.payload;
    },
    setPlayerValue(state, action) {
      state.playerValue = action.payload;
    },
    setPlayerClubImage(state, action) {
      state.playerClubImage = action.payload;
    },
    setIsFinded(state, action) {
      state.isFinded = action.payload;
    },
  },
});

export const {
  setPlayerLeague,
  setPlayerCountry,
  setPlayerClub,
  setPlayerPosition,
  setPlayerAge,
  setPlayerValue,
  setPlayerClubImage,
  setIsFinded,
} = playerFindSlice.actions;

export const selectPlayerLeague = (state: any) => state.playerFind.playerLeague;
export const selectPlayerCountry = (state: any) =>
  state.playerFind.playerCountry;
export const selectPlayerClub = (state: any) => state.playerFind.playerClub;
export const selectPlayerPosition = (state: any) =>
  state.playerFind.playerPosition;
export const selectPlayerAge = (state: any) => state.playerFind.playerAge;
export const selectPlayerValue = (state: any) => state.playerFind.playerValue;
export const selectPlayerClubImage = (state: any) =>
  state.playerFind.playerClubImage;
export const selectIsFinded = (state: any) => state.playerFind.isFinded;

export default playerFindSlice.reducer;
