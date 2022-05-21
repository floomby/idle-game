import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum GameStates {
  Naming,
  Story,
  Playing,
}

export interface GameState {
  phase: GameStates;
  dialogIndex: number;
  frame: number;
}

const initialState: GameState = {
  phase: GameStates.Naming,
  dialogIndex: 0,
  frame: 0,
};

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    setGameState: (state, action: PayloadAction<GameStates>) => {
      state.phase = action.payload;
    },
    advanceDialog: (state) => {
      state.dialogIndex++;
    },
    resetDialog: (state) => {
      state.dialogIndex = 0;
    },
    advanceFrame: (state) => {
      state.frame++;
    },
    restore: (state, action: PayloadAction<string>) => {
      Object.assign(state, JSON.parse(action.payload));
    },
  },
});

export { GameStates };
export const {
  setGameState,
  advanceDialog,
  resetDialog,
  advanceFrame,
  restore,
} = gameStateSlice.actions;
export default gameStateSlice.reducer;
