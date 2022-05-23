import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// TODO This seems worse and more verbose than how I did the others
type CapitalType = "scientists" | "light_launch_vehicles" | "heavy_launch_vehicles" | "research_director";

export interface CapitalState {
  values: Record<CapitalType, [number, boolean]>;
}

const initialState: CapitalState = {
  values: {
    scientists: [0, true],
    light_launch_vehicles: [0, true],
    heavy_launch_vehicles: [0, true],
    research_director: [0, true],
  },
};

export const capitalSlice = createSlice({
  name: "capital",
  initialState,
  reducers: {
    capitalDelta: (
      state,
      action: PayloadAction<Partial<Record<CapitalType, number>>>
    ) => {
      Object.keys(action.payload).forEach((key) => {
        state.values[key as CapitalType][0] += (
          action.payload as Record<CapitalType, number>
        )[key as CapitalType];
      });
    },
    exposeCapital: (state, action: PayloadAction<CapitalType>) => {
      state.values[action.payload][1] = true;
    },
    restore: (state, action: PayloadAction<string>) => {
      Object.assign(state, JSON.parse(action.payload));
    },
  },
});

export type { CapitalType };
export const { capitalDelta, exposeCapital, restore } = capitalSlice.actions;

export default capitalSlice.reducer;
