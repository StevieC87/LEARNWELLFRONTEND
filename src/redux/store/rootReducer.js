// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import SlideMenuSlice from "../slices/SlideMenu";
import PagesSlice from "../slices/PagesSlice";

const rootReducer = combineReducers({
  SlideMenuSlice: SlideMenuSlice,
  PagesSlice: PagesSlice,
  /* UtilsSlice: UtilsSlice, */
});

export default rootReducer;
