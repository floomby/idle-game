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
  },
});

export const { addNews, removeOldestNews } = newsSlice.actions;

export default newsSlice.reducer;
