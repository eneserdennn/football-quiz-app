import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// http://api.eneserden.com/api/

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://api.eneserden.com/api/" }),
  endpoints: (builder) => ({
    getLeagues: builder.query({
      query: () => `/leagues`,
    }),
    getRandomPlayer: builder.query({
      query: ({ minMarketValue, maxMarketValue, league }) => ({
        url: "/search",
        params: {
          minMarketValue,
          maxMarketValue,
          league: encodeURIComponent(league)
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
