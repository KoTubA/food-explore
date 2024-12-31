"use client";

import { Provider } from "react-redux";
import { store } from "@/src/redux/store";
import React from "react";

// This component will wrap your app with the Redux Provider
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
