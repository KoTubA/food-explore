"use client";

import { ReduxProvider } from "@/src/redux/provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
