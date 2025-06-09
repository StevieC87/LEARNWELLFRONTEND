import { createSlice } from "@reduxjs/toolkit";

const PagesSlice = createSlice({
  name: "PagesSlice",
  initialState: {
    fields: {},
    slugduplicatewarning: false,
    triggerSEOrefresh: 0,
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
        label,
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
        label,
      };
    },
    setSlugDuplicateWarning(state, action) {
      state.slugduplicatewarning = action.payload;
    },
    setTriggerSEORefresh(state, action) {
      state.triggerSEOrefresh = action.payload;
    },
  },
});

export const { updateField, setSlugDuplicateWarning, setTriggerSEORefresh } =
  PagesSlice.actions;

export default PagesSlice.reducer;
