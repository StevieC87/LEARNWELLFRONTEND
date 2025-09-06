import { createSlice } from "@reduxjs/toolkit";

const AnalyticsSlice = createSlice({
  name: "AnalyticsSlice",
  initialState: {
    currentsiteid: "",
    triggerfetch: 0, // Added triggerfetch to the initial state
    currentsizetimezone: "",
    countryfilter: "",
  },
  reducers: {
    setcurrentsiteid: (state, action) => {
      state.currentsiteid = action.payload;
    },
    incrementTriggerFetch: (state) => {
      state.triggerfetch += 1;
    },
    setCurrentSiteTimezone: (state, action) => {
      state.currentsizetimezone = action.payload;
    },
    setCountryFilter: (state, action) => {
      state.countryfilter = action.payload;
    },
  },
});

export const {
  setcurrentsiteid,
  incrementTriggerFetch,
  setCurrentSiteTimezone,
  setCountryFilter,
} = AnalyticsSlice.actions;

export default AnalyticsSlice.reducer;
