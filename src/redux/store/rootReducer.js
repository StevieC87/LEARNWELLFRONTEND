// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import SlideMenuSlice from "../slices/SlideMenu";
import PagesSlice from "../slices/PagesSlice";
import DashSlice from "../slices/DashSlice";
import JSONLDSlice from "../slices/JSONLDSlice";
import UISlice from "../slices/UISlice";

const rootReducer = combineReducers({
  SlideMenuSlice: SlideMenuSlice,
  PagesSlice: PagesSlice,
  DashSlice: DashSlice,
  JSONLDSlice: JSONLDSlice,
  UISlice: UISlice,

  /* UtilsSlice: UtilsSlice, */
});

export default rootReducer;
