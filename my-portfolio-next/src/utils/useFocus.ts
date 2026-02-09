"use client";
import { useContext } from "react";
import { FocusContext } from "./FocusContext";

export const useFocus = () => useContext(FocusContext);
