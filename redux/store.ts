import animationReducer from "./features/animationSlice";
import { apiSlice } from "./api/apiSlice";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import playerFindReducer from "./features/player/playerFindSlice";
import randomPlayerReducer from "./features/randomPlayerSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    randomPlayer: randomPlayerReducer,
    animation: animationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    playerFind: playerFindReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(apiSlice.middleware),

  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
