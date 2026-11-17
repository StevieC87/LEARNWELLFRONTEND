"use client";
import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store/store";

const ReduxProvider = ({ children }) => {
  // Created once per mount: once per request on the server, once per page
  // load in the browser (the root layout keeps it across navigations).
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
