import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayerState {
  name: string;
  score: number;
}

const initialState: PlayerState = {
  name: "",
  score: 0,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    awardScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    restore: (state, action: PayloadAction<string>) => {
      Object.assign(state, JSON.parse(action.payload));
    },
  },
});

export const { setName, restore } = playerSlice.actions;

export default playerSlice.reducer;
