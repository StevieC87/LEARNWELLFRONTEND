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
      const { schemablocks } = action.payload;
      /*  if (!Array.isArray(state.blocksandfields)) {
        state.blocksandfields = [];
      } */
      state.blocksandfields.push(...schemablocks);
    },
  },
});

export const { updateBlocksAndFields } = JSONLDSlice.actions;

export default JSONLDSlice.reducer;
