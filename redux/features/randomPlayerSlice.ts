import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

interface Player {
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
  last_contract_extension_date: string | null;
  outfitter: string;
  social_media: string[];
  market_value: number;
  transfer_history: TransferHistory[];
}

interface TransferHistory {
  _id: string;
  season: string;
  date: string;
  old_club: string;
  new_club: string;
  transfer_market_value: number;
  fee: string | null;
}

interface RandomPlayerState {
  player: Player | null;
}

const initialState: RandomPlayerState = {
  player: null,
};

const randomPlayerSlice = createSlice({
  name: "randomPlayer",
  initialState,
  reducers: {
    setRandomPlayer(state, action) {
      state.player = action.payload;
    },
  },
});

export const { setRandomPlayer } = randomPlayerSlice.actions;

export const selectRandomPlayer = (state: RootState) =>
  state.randomPlayer.player;

export default randomPlayerSlice.reducer;
