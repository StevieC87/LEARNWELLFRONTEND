import { createSlice } from "@reduxjs/toolkit";

const SharedSlice = createSlice({
  name: "SharedSlice",
  initialState: {
    //isModalTrashopen: false,
    fields: {},
  },

  reducers: {
    updateSharedFields(state, action) {
      const { name, content, type, required, placeholder, fields } =
        action.payload;

      if (!state.fields[name]) {
        state.fields[name] = {};
      }

      state.fields[name] = {
        ...state.fields[name],
        name,
        content,
        type,
        required,
        placeholder,
        fields,
      };
    },
  },
});

export const { updateSharedFields } = SharedSlice.actions;

export default SharedSlice.reducer;
