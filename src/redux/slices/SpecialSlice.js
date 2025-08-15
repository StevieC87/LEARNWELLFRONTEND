import { createSlice } from "@reduxjs/toolkit";

const SpecialSlice = createSlice({
  name: "SpecialSlice",
  initialState: {
    fields: {},
  },

  reducers: {
    sethello: (state, action) => {
      state.hello = action.payload;
    },
    updateField(state, action) {
      const {
        name,
        id,
        locale,
        content,
        pagename,
        type,
        belongsto,
        createdAt,
        required,
        placeholder,
        fields,
      } = action.payload;

      if (!state.fields[name]) {
        state.fields[name] = {};
      }

      state.fields[name] = {
        ...state.fields[name],
        name,
        id,
        locale,
        content,
        pagename,
        type,
        belongsto,
        createdAt,
        required,
        placeholder,
        fields,
      };
    },
  },
});

export const { updateField } = SpecialSlice.actions;

export default SpecialSlice.reducer;
