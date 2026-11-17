// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import SlideMenuSlice from "../slices/SlideMenu";
import PagesSlice from "../slices/PagesSlice";
import DashSlice from "../slices/DashSlice";
import JSONLDSlice from "../slices/JSONLDSlice";
import UISlice from "../slices/UISlice";
import SharedSlice from "../slices/SharedSlice";
import SpecialSlice from "../slices/SpecialSlice";
import AnalyticsSlice from "../slices/AnalyticsSlice.js"; // Import the AnalyticsSlice
import AnalyticsUISlice from "../slices/AnalyticsUISlice.js"; // Import the AnalyticsUISlice
import CustomTypesSlice from "../slices/CustomTypesSlice.js";
import flashcardSlice from "../slices/flashcardSlice"; // Flashcard lessons

const rootReducer = combineReducers({
  SlideMenuSlice: SlideMenuSlice,
  PagesSlice: PagesSlice,
  DashSlice: DashSlice,
  JSONLDSlice: JSONLDSlice,
  UISlice: UISlice,
  SharedSlice: SharedSlice,
  SpecialSlice: SpecialSlice,
  AnalyticsSlice: AnalyticsSlice,
  AnalyticsUISlice: AnalyticsUISlice,
  CustomTypesSlice: CustomTypesSlice,
  flashcardSlice: flashcardSlice,
  // Add the AnalyticsSlice here
  /* UtilsSlice: UtilsSlice, */
});

export default rootReducer;
