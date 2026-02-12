"use client";
import { use } from "react";
import { FocusContext } from "./FocusContext";

export const useFocus = () => use(FocusContext);
