import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import resourcesData from "../resources.json";

export interface ResourcesState {
  values: Record<string, [number, string[]]>;
  market: {
    prices: Record<string, number>;
    targets: Record<string, number>;
    pressure: Record<string, number>;
  };
}

const initialState: ResourcesState = {
  values: Object.fromEntries(
    resourcesData.map((value) => [
      value.name,
      [value.starting, value.prerequisites],
    ])
  ),
  market: {
    prices: Object.fromEntries(
      resourcesData.filter((value) => !!value.startingMarketPrice).map((value) => [
        value.name,
        value.startingMarketPrice!,
      ])
    ),
    targets: Object.fromEntries(
      resourcesData.filter((value) => !!value.startingMarketPrice).map((value) => [
        value.name,
        value.startingMarketPrice!,
      ])
    ),
    pressure: {},
  },
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
      state.values["dollars"][0] -= amount * state.market.prices[resource]!;
      if (!state.market.pressure[resource]) {
        state.market.pressure[resource] = amount;
      } else {
        state.market.pressure[resource] += amount;
      }
    },
    updateMarket: (state, action: PayloadAction<Record<string, [number, number]>>) => {
      Object.entries(action.payload).forEach(([key, [price, target]]) => {
        state.market.prices[key] = price;
        state.market.targets[key] = target;
      });
    },
    restore: (state, action: PayloadAction<string>) => {
      Object.assign(state, JSON.parse(action.payload));
    },
  },
});

export const { resourceDelta, purchaseResource, updateMarket, restore } =
  resourcesSlice.actions;

export default resourcesSlice.reducer;
