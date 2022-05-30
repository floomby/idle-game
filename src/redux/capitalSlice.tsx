import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import capitalData from "../capital.json";

export interface CapitalState {
  values: Record<string, [number, boolean]>;
}

const initialState: CapitalState = {
  values: Object.fromEntries(capitalData.map(capitalItem => [capitalItem.name, [0, true]])),
};

export const capitalSlice = createSlice({
  name: "capital",
  initialState,
  reducers: {
    capitalDelta: (
      state,
      action: PayloadAction<Partial<Record<string, number>>>
    ) => {
      Object.keys(action.payload).forEach((key) => {
        state.values[key][0] += (
          action.payload as Record<string, number>
        )[key];
      });
    },
    exposeCapital: (state, action: PayloadAction<string>) => {
      state.values[action.payload][1] = true;
    },
    restore: (state, action: PayloadAction<string>) => {
      Object.assign(state, JSON.parse(action.payload));
    },
  },
});

export const { capitalDelta, exposeCapital, restore } = capitalSlice.actions;

export default capitalSlice.reducer;
