"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import FetchUser from "../components/FetchUser"; // استدعاء الكومبوننت الجديد

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <FetchUser /> {/* استدعاء الكومبوننت هنا */}
      {children}
    </Provider>
  );
};

export default ReduxProvider;
