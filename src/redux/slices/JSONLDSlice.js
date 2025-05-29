import { createSlice } from "@reduxjs/toolkit";

const JSONLDSlice = createSlice({
  name: "JSONLDSlice",
  initialState: {
    hello: "hello",
    blocksandfields: [],
  },

  reducers: {
    sethello: (state, action) => {
      state.hello = action.payload;
    },
    //blocksandfields
    updateBlocksAndFields(state, action) {
      const { blocksandfields } = action.payload;
      state.blocksandfields = blocksandfields;
    },
  },
});

export const { updateBlocksAndFields } = JSONLDSlice.actions;

export default JSONLDSlice.reducer;
