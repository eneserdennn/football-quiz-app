import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// http://api.eneserden.com/api/

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://api.eneserden.com/api/" }),
  endpoints: (builder) => ({
    getLeagues: builder.query({
      query: () => `/leagues`,
    }),
    getRandomPlayer: builder.query({
      query: () => ({
        url: "/search",
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
