import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import resourcesData from "../resources.json";

export interface ResourcesState {
  values: Record<string, [number, string[]]>;
}

const initialState: ResourcesState = {
  values: Object.fromEntries(
    resourcesData.map((value) => [
      value.name,
      [value.starting, value.prerequisites],
    ])
  ),
};

export const resourcesSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    resourceDelta: (state, action: PayloadAction<Record<string, number>>) => {
      Object.keys(action.payload).forEach((key) => {
        state.values[key as string][0] += (
          action.payload as Record<string, number>
        )[key as string];
      });
    },
  },
});

export const { resourceDelta } = resourcesSlice.actions;

export default resourcesSlice.reducer;
