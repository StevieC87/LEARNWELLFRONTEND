//THIS IS FOR THE EDMIT PAGE ETC
//FOR BETWEEN COMPOENNETS LKE SET LANGUAGE ETC import { createSlice } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const DashSlice = createSlice({
  name: "DashSlice",
  initialState: {
    selectedLanguage: "",
    multilingualsharedid: "",
    pageexiststhislanguage: false, // This is used to check if a page exists in the current language
  },

  reducers: {
    setSelectedLanguage(state, action) {
      state.selectedLanguage = action.payload;
    },
    setMultilingualSharedId(state, action) {
      state.multilingualsharedid = action.payload;
    },
    setPageExistsThisLanguage(state, action) {
      state.pageexiststhislanguage = action.payload;
    },
  },
});

export const {
  setSelectedLanguage,
  setMultilingualSharedId,
  setPageExistsThisLanguage,
} = DashSlice.actions;

export default DashSlice.reducer;
