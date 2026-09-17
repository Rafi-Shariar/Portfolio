"use client";
import React, { ReactNode } from "react";
import QueryProvider from "./query.provider";
import SmoothScrollProvider from "./SmoothScrollerProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return <SmoothScrollProvider><QueryProvider>{children}</QueryProvider></SmoothScrollProvider>;
};

export default Providers;
