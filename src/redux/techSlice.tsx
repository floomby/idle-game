import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { graphData, graphEvents } from "react-graph-vis";
import wrap from "word-wrap";

import techs from "../tech.json";

export interface TechData {
  description: string;
  prerequisites: string[];
  unlocked: boolean;
  available: boolean;
}

export interface TechState {
  values: any;
  graph: graphData;
  events?: graphEvents;
}

const initialState: TechState = {
  values: Object.fromEntries(
    techs.map((tech) => [
      tech.name,
      { description: tech.description, prerequisites: tech.prerequisites, unlocked: false, available: false },
    ])
  ),
  graph: {
    nodes: [],
    edges: [],
  },
};

export const techSlice = createSlice({
  name: "tech",
  initialState,
  reducers: {
    unlockTech: (state, action: PayloadAction<string>) => {
      if (state.values[action.payload].unlocked) {
        return;
      }
      state.values[action.payload].unlocked = true;
      // Somewhat inefficient, but it's ok for now
      state.graph.edges = [];
      state.graph.nodes = [];
      techs.map((tech) => tech.name).forEach((key) => {
        let isAvailable = true;
        let tmpEdges = [];
        for (const prerequisite of state.values[key].prerequisites) {
          if (!state.values[prerequisite].unlocked) {
            isAvailable = false;
            break;
          }
          tmpEdges.push({ from: prerequisite, to: key });
        }
        if (isAvailable) {
          state.values[key].available = true;
          state.graph.nodes.push({
            id: key,
            label: key,
            color: "#e04141",
            title: wrap(state.values[key].description, { width: 40 }),
          });
          state.graph.edges = [...state.graph.edges, ...tmpEdges];
        }
      });
      console.log(state.graph.edges);
      console.log(state.graph.nodes);
    },
  },
});

export const { unlockTech } = techSlice.actions;

export default techSlice.reducer;
