// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import SlideMenuSlice from "../slices/SlideMenu";
import PagesSlice from "../slices/PagesSlice";
import DashSlice from "../slices/DashSlice";

const rootReducer = combineReducers({
  SlideMenuSlice: SlideMenuSlice,
  PagesSlice: PagesSlice,
  DashSlice: DashSlice,
  /* UtilsSlice: UtilsSlice, */
});

export default rootReducer;
