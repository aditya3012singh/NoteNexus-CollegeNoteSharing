import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type CurrPageState = {
  page: string;
};

const initialState: CurrPageState = {
  page: 'home',
};

const currPageSlice = createSlice({
  name: 'currPage',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<string>) {
      state.page = action.payload;
    },
  },
});

export const { setPage } = currPageSlice.actions;
export default currPageSlice.reducer;
