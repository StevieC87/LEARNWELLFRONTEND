//THIS IS FOR THE EDMIT PAGE ETC
//FOR BETWEEN COMPOENNETS LKE SET LANGUAGE ETC import { createSlice } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const DashSlice = createSlice({
  name: "DashSlice",
  initialState: {
    selectedLanguage: "",
    multilingualsharedid: "",
    pageexiststhislanguage: "", // This is used to check if a page exists in the userrole: "",
    settings: {
      multilingual: "",
      defaultlanguage: "",
      languages: [],
    },
    userrole: "", // This is used to check if a page exists in the userrole
    userid: "",
    enableuserregistration: "", // This is used to check if user registration is enabled
    sites: [],
    darkmodeOn: false,
    zoomChart: false,
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
    setUserRole(state, action) {
      state.userrole = action.payload;
    },
    setSettings(state, action) {
      state.settings = action.payload; // This will set the entire settings object
    },
    setUserId(state, action) {
      state.userid = action.payload; // This will set the user ID
    },
    setEnableUserRegistration(state, action) {
      state.enableuserregistration = action.payload; // This will set the user registration setting
    },
    setdarkmodeOn(state, action) {
      state.darkmodeOn = action.payload; // This will set the dark mode setting
    },
    setZoomChart(state, action) {
      state.zoomChart = action.payload; // This will set the zoom chart setting
    },
  },
});

export const {
  setSelectedLanguage,
  setMultilingualSharedId,
  setPageExistsThisLanguage,
  setUserRole,
  setSettings,
  setUserId,
  setEnableUserRegistration,
  setdarkmodeOn,
  setZoomChart,
} = DashSlice.actions;

export default DashSlice.reducer;
