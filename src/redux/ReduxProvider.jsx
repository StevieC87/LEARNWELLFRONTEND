'use client";'
import { Provider } from "react-redux";
import store from "./store/store"; // Adjust the path based on your directory structure

const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
