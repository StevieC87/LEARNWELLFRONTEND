// store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      if (typeof window !== "undefined") {
        delete window.__REDUX_DEVTOOLS_EXTENSION__;
      }
      return next(action);
    }),
});

export default store;
