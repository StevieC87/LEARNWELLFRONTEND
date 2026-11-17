import { createSlice } from "@reduxjs/toolkit";

const SlideMenuSlice = createSlice({
  name: "SlideMenuSlice",
  initialState: {
    hello: "hello",
    isMobileNavOpen: false,
    isTabletNavOpen: false,
    buttonexpandtablet: false,
  },

  reducers: {
    sethello: (state, action) => {
      state.hello = action.payload;
    },
    setIsMobileNavOpen: (state, action) => {
      state.isMobileNavOpen = action.payload;
    },
    setIsTabletNavOpen: (state, action) => {
      state.isTabletNavOpen = action.payload;
    },

    setIsButtonExpandTablet: (state, action) => {
      state.buttonexpandtablet = typeof action.payload === "boolean"
        ? action.payload
        : !state.buttonexpandtablet;
    },
  },
});

export const {
  setIsMobileNavOpen,
  setIsTabletNavOpen,
  setIsButtonExpandTablet,
} = SlideMenuSlice.actions;

export default SlideMenuSlice.reducer;
