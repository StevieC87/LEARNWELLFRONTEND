import { createSlice } from "@reduxjs/toolkit";

const SlideMenuSlice = createSlice({
  name: "SlideMenuSlice",
  initialState: {
    hello: "hello",
    isSideNavOpen: false,
  },

  reducers: {
    sethello: (state, action) => {
      state.helloobj.hello = action.payload;
    },
    setIsSideNavOpen: (state, action) => {
      state.isSideNavOpen = action.payload;
    },
  },
});

export const { setIsSideNavOpen } = SlideMenuSlice.actions;

export default SlideMenuSlice.reducer;
