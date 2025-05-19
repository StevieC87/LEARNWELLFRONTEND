import { createSlice } from "@reduxjs/toolkit";

const PagesSlice = createSlice({
  name: "PagesSlice",
  initialState: {
    hello: "hello",
    fields: {},
  },

  reducers: {
    sethello: (state, action) => {
      state.hello = action.payload;
    },
    updateField(state, action) {
      const { name, id, locale, content, pagename, type } = action.payload;

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
      };
    },
  },
});

export const { updateField } = PagesSlice.actions;

export default PagesSlice.reducer;
