//THIS IS FOR THE EDMIT PAGE ETC
//FOR BETWEEN COMPOENNETS LKE SET LANGUAGE ETC import { createSlice } from "@reduxjs/toolkit";

const DashSlice = createSlice({
  name: "DashSlice",
  initialState: {
    selectedLanguage: "",
  },

  reducers: {
    setSelectedLanguage(state, action) {
      state.isSideNavOpen = action.payload;
    },
  },
});

export const { setSelectedLanguage } = DashSlice.actions;

export default DashSlice.reducer;
