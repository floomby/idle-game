import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum GameStates {
  Naming,
  Story,
  Playing,
}

export interface GameState {
  phase: GameStates;
  dialogIndex: number;
}

const initialState: GameState = {
  phase: GameStates.Naming,
  dialogIndex: 0,
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
  },
});

export { GameStates };
export const { setGameState, advanceDialog, resetDialog } = gameStateSlice.actions;
export default gameStateSlice.reducer;
