import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import resourcesData from "../resources.json";

export interface ResourcesState {
  values: Record<string, [number, string[]]>;
  market: Record<string, number>;
}

const initialState: ResourcesState = {
  values: Object.fromEntries(
    resourcesData.map((value) => [
      value.name,
      [value.starting, value.prerequisites],
    ])
  ),
  market: {}
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
    purchaseResource: (state, action: PayloadAction<[string, number]>) => {
      const [resource, amount] = action.payload;
      state.values[resource][0] += amount;
      state.values["dollars"][0] -= amount * state.market[resource];
    },
    initMarket: (state) => {
      state.market["steel"] = 1;
    },
  },
});

export const { resourceDelta, purchaseResource, initMarket } = resourcesSlice.actions;

export default resourcesSlice.reducer;
