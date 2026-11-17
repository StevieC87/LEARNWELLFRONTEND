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
      // Replaces rather than appends, so a second fetch landing after one
      // clean can't list every block twice.
      const { schemablocks } = action.payload;
      state.blocksandfields = Array.isArray(schemablocks) ? schemablocks : [];
    },
    changeBlocksAndFieldsblockupdatefield(state, action) {
      const { blocknameparentblock, name, content, type } = action.payload;
      // Find the block by name
      const block = state.blocksandfields.find(
        (block) => block.name === blocknameparentblock
      );
      if (block) {
        // Find the field by name within the block
        const field = block.fields.find((field) => field.name === name);
        if (field) {
          // Update the field's content and type
          field.value = content;
          field.type = type;
        }
      }
    },
    cleanBlocksandFields(state) {
      state.blocksandfields = [];
    },
  },
});

export const {
  updateBlocksAndFields,
  changeBlocksAndFieldsblockupdatefield,
  cleanBlocksandFields,
} = JSONLDSlice.actions;

export default JSONLDSlice.reducer;
