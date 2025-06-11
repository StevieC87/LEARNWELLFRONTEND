import { createSlice } from "@reduxjs/toolkit";

const UISlice = createSlice({
  name: "UISlice",
  initialState: {
    isModalTrashopen: false,
  },

  reducers: {
    setIsModalTrashOpen: (state, action) => {
      state.isModalTrashopen = action.payload;
    },
  },
});

export const { setIsModalTrashOpen } = UISlice.actions;

export default UISlice.reducer;
