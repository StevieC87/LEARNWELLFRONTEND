import { createSlice } from "@reduxjs/toolkit";

const PagesSlice = createSlice({
  name: "PagesSlice",
  initialState: {
    fields: {},
    slugduplicatewarning: false,
    triggerSEOrefresh: 0,
    hasChanges: false,
    currentimagefield: null,
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
        relation,
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
        relation,
      };
    },
    setSlugDuplicateWarning(state, action) {
      state.slugduplicatewarning = action.payload;
    },
    setTriggerSEORefresh(state, action) {
      state.triggerSEOrefresh = action.payload;
    },
    setHasChanges(state, action) {
      state.hasChanges = action.payload;
    },
    setCurrentImageField(state, action) {
      state.currentimagefield = action.payload;
      /*  const { name, id, locale, content, type, placeholder, required } =
        action.payload;

      state.currentimagefield = {
        name,
        id,
        locale,
        content,
        type,
        placeholder,
        required,
      }; */
    },

    /*  updateArrayField(state, action) {
      const { parentField, index, subfield, value, content } = action.payload;

      if (
        state.fields[parentField] &&
        Array.isArray(state.fields[parentField].fields) &&
        state.fields[parentField].fields[index]
      ) {
        //  state.fields[parentField].fields[index][subfield] = value;
        // state.fields[parentField].fields[index].content = content;
        state.fields[parentField].fields[index] = {
          ...state.fields[parentField].fields[index],
          content,
        };
      }
    }, */
  },
});

export const {
  updateField,
  setSlugDuplicateWarning,
  setTriggerSEORefresh,
  setHasChanges,
  updateArrayField,
  setCurrentImageField,
} = PagesSlice.actions;

export default PagesSlice.reducer;
