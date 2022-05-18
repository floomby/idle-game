import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ResourceType = "dollars" | "aluminum" | "silicon";

export interface ResourcesState {
  values: Record<ResourceType, [number, boolean]>;
}

const initialState: ResourcesState = {
  values: {
    dollars: [100000, false],
    aluminum: [0, false],
    silicon: [0, false],
  },
};

export const resourcesSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    resourceDelta: (
      state,
      action: PayloadAction<Partial<Record<ResourceType, number>>>
    ) => {
      Object.keys(action.payload).forEach((key) => {
        state.values[key as ResourceType][0] += (
          action.payload as Record<ResourceType, number>
        )[key as ResourceType];
      });
    },
    exposeResource: (state, action: PayloadAction<ResourceType>) => {
      state.values[action.payload][1] = true;
    },
  },
});

export type { ResourceType };
export const { resourceDelta, exposeResource } = resourcesSlice.actions;

export default resourcesSlice.reducer;
