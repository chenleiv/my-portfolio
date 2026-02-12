"use client";
import { use } from "react";
import { FocusContext } from "../context/FocusContext";

export const useFocus = () => use(FocusContext);
