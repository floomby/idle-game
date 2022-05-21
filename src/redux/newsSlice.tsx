import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NewsState {
  items: string[];
  total: number;
  removed: number;
}

const initialState: NewsState = {
  items: [],
  total: 0,
  removed: 0,
};

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    addNews: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
      state.total++;
    },
    removeOldestNews: (state) => {
      state.items.shift();
      state.removed++;
    },
    restore: (state, action: PayloadAction<string>) => {
      Object.assign(state, JSON.parse(action.payload));
    },
  },
});

export const { addNews, removeOldestNews, restore } = newsSlice.actions;

export default newsSlice.reducer;
