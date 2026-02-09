"use client";
import { createContext } from "react";
import { FocusContextDefault, type FocusContextValue } from "./focus.types";

export const FocusContext = createContext<FocusContextValue>(FocusContextDefault);