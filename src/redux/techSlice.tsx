import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import wrap from "word-wrap";

import techs from "../tech.json";

const techNodes = new Map<
  string,
  { x: number; y: number; name: string; description: string; hardness: number }
>(
  techs.map((value, index) => [
    value.name,
    {
      x: value.x,
      y: value.y,
      name: value.name,
      description: value.description,
      hardness: value.hardness,
    },
  ])
);

export interface TechData {
  description: string;
  prerequisites: string[];
  unlocked: boolean;
  available: boolean;
  progress: number;
}

// TODO fix this interface
export interface TechState {
  values: Record<
    string,
    {
      available: boolean;
      unlocked: boolean;
      progress: number;
      prerequisites: string[];
      description: string;
    }
  >;
  graph: any;
  progressable: string[];
  progressCounter: number;
}

const initialState: TechState = {
  values: Object.fromEntries(
    techs.map((tech) => [
      tech.name,
      {
        description: tech.description,
        prerequisites: tech.prerequisites,
        unlocked: false,
        available: false,
        progress: 0,
      },
    ])
  ),
  graph: {
    nodes: [],
    links: [],
  },
  progressable: [],
  progressCounter: 0,
};

// TODO: refactor to reduce redundancy
export const techSlice = createSlice({
  name: "tech",
  initialState,
  reducers: {
    initTech: (state) => {
      state.graph.links = [];
      state.graph.nodes = [];
      state.progressable = [];
      techs
        .map((tech) => tech.name)
        .forEach((key) => {
          let isAvailable = true;
          let tmpLinks = [];
          for (const prerequisite of state.values[key].prerequisites) {
            if (!state.values[prerequisite].unlocked) {
              isAvailable = false;
              break;
            }
            tmpLinks.push({
              source: techNodes.get(prerequisite),
              target: techNodes.get(key),
            });
          }
          if (isAvailable) {
            state.values[key].available = true;
            state.graph.nodes.push({
              ...techNodes.get(key)!,
              completed: state.values[key].unlocked,
              progress: Math.min(
                1.0,
                state.values[key].progress / techNodes.get(key)!.hardness
              ),
            });
            state.graph.links = [...state.graph.links, ...tmpLinks];
            if (!state.values[key].unlocked) {
              state.progressable.push(key);
            }
          }
        });
    },
    unlockTech: (state, action: PayloadAction<string>) => {
      if (state.values[action.payload].unlocked) {
        return;
      }
      state.values[action.payload].unlocked = true;
      state.values[action.payload].progress = techNodes.get(
        action.payload
      )!.hardness;
      // Somewhat inefficient, but it's ok for now
      state.graph.links = [];
      state.graph.nodes = [];
      state.progressable = [];
      techs
        .map((tech) => tech.name)
        .forEach((key) => {
          let isAvailable = true;
          let tmpLinks = [];
          for (const prerequisite of state.values[key].prerequisites) {
            if (!state.values[prerequisite].unlocked) {
              isAvailable = false;
              break;
            }
            tmpLinks.push({
              source: techNodes.get(prerequisite),
              target: techNodes.get(key),
            });
          }
          if (isAvailable) {
            state.values[key].available = true;
            state.graph.nodes.push({
              ...techNodes.get(key)!,
              completed: state.values[key].unlocked,
              progress: Math.min(
                1.0,
                state.values[key].progress / techNodes.get(key)!.hardness
              ),
            });
            state.graph.links = [...state.graph.links, ...tmpLinks];
            if (!state.values[key].unlocked) {
              state.progressable.push(key);
            }
          }
        });
    },
    applyProgress: (
      state,
      action: PayloadAction<{ tech: string; progress: number }>
    ) => {
      if (state.values[action.payload.tech].unlocked) {
        return;
      }
      state.progressCounter += action.payload.progress;
      state.values[action.payload.tech].progress += action.payload.progress;
      if (
        state.values[action.payload.tech].progress >=
        techNodes.get(action.payload.tech)!.hardness
      ) {
        state.values[action.payload.tech].progress = techNodes.get(
          action.payload.tech
        )!.hardness;
        state.values[action.payload.tech].unlocked = true;
      } else {
        const index = state.graph.nodes.findIndex(
          (node: any) => node.name === action.payload.tech
        );
        state.graph.nodes[index].progress = Math.min(
          1.0,
          state.values[action.payload.tech].progress /
            techNodes.get(action.payload.tech)!.hardness
        );
        return;
      }
      state.graph.links = [];
      state.graph.nodes = [];
      state.progressable = [];
      techs
        .map((tech) => tech.name)
        .forEach((key) => {
          let isAvailable = true;
          let tmpLinks = [];
          for (const prerequisite of state.values[key].prerequisites) {
            if (!state.values[prerequisite].unlocked) {
              isAvailable = false;
              break;
            }
            tmpLinks.push({
              source: techNodes.get(prerequisite),
              target: techNodes.get(key),
            });
          }
          if (isAvailable) {
            state.values[key].available = true;
            state.graph.nodes.push({
              ...techNodes.get(key)!,
              completed: state.values[key].unlocked,
              progress: Math.min(
                1.0,
                state.values[key].progress / techNodes.get(key)!.hardness
              ),
            });
            state.graph.links = [...state.graph.links, ...tmpLinks];
            if (!state.values[key].unlocked) {
              state.progressable.push(key);
            }
          }
        });
    },
    restore: (state, action: PayloadAction<string>) => {
      Object.assign(state, JSON.parse(action.payload));
    },
  },
});

export const { unlockTech, initTech, applyProgress, restore } =
  techSlice.actions;

export default techSlice.reducer;
