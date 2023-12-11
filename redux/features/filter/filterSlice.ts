import {createSlice} from "@reduxjs/toolkit";

interface FilterState {
    minMarketValue: number;
    maxMarketValue: number;
    league: string;
}

const initialState: FilterState = {
    minMarketValue: 0,
    maxMarketValue: 200000000,
    league: "Premier League",
};

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setMinMarketValue(state, action) {
            state.minMarketValue = action.payload;
        },
        setMaxMarketValue(state, action) {
            state.maxMarketValue = action.payload;
        },
        setLeague(state, action) {
            state.league = action.payload;
        },
    },
});

export const {setMinMarketValue, setMaxMarketValue, setLeague} = filterSlice.actions;

export default filterSlice.reducer;
