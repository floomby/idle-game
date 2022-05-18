import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./redux/playerSlice";
import resourcesReducer from "./redux/resourcesSlice";
import gameStateReducer from "./redux/gameStateSlice";
import techReducer from "./redux/techSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    resources: resourcesReducer,
    gameState: gameStateReducer,
    tech: techReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
