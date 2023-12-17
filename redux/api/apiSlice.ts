import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL= "https://api.eneserden.com/football/"

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  endpoints: (builder) => ({
    getLeagues: builder.query({
      query: () => `/leagues`,
    }),
    getRandomPlayer: builder.query({
      query: ({ minMarketValue, maxMarketValue, league }) => ({
        url: "players/random",
        params: {
          minMarketValue,
          maxMarketValue,
          league: league
        }
      }),
    }),
    getAllPlayers: builder.query({
      query: () => `/players`,
    }),
    getPlayerById: builder.query({
      query: (id) => `/player/${id}`,
    }),
  }),
});

export const {
  useGetLeaguesQuery,
  useGetRandomPlayerQuery,
  useGetAllPlayersQuery,
  useGetPlayerByIdQuery,
} = apiSlice;
