import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { pageNumber: number } = {
  pageNumber: 1,
};
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setPageNumber(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
  },
});

export const { setPageNumber } = blogSlice.actions;

export default blogSlice.reducer;
