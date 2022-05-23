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
  completedEvents: Record<string, boolean>;
}

const initialState: GameState = {
  phase: GameStates.Naming,
  dialogIndex: 0,
  frame: 0,
  completedEvents: {},
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
    completeEvent: (state, action: PayloadAction<string>) => {
      state.completedEvents[action.payload] = true;
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
  completeEvent,
  restore,
} = gameStateSlice.actions;
export default gameStateSlice.reducer;
