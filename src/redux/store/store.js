// store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { layoutGestureMiddleware } from "./layoutGesture.js";

// A factory, not a module-level store: on the server one module instance
// serves every request, so a shared store would leak state between users.
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(layoutGestureMiddleware),
    devTools: process.env.NODE_ENV === "development",
  });
