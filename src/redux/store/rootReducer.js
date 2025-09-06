// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import SlideMenuSlice from "../slices/SlideMenu";
import PagesSlice from "../slices/PagesSlice";
import DashSlice from "../slices/DashSlice";
import JSONLDSlice from "../slices/JSONLDSlice";
import UISlice from "../slices/UISlice";
import SharedSlice from "../slices/SharedSlice";
import SpecialSlice from "../slices/SpecialSlice";
import flashcardSlice from "../slices/flashcardSlice";
import AnalyticsSlice from "../slices/AnalyticsSlice";

const rootReducer = combineReducers({
  SlideMenuSlice: SlideMenuSlice,
  PagesSlice: PagesSlice,
  DashSlice: DashSlice,
  JSONLDSlice: JSONLDSlice,
  UISlice: UISlice,
  SharedSlice: SharedSlice,
  SpecialSlice: SpecialSlice,
  flashcardSlice: flashcardSlice,
  AnalyticsSlice: AnalyticsSlice,
  /* UtilsSlice: UtilsSlice, */
});

export default rootReducer;
