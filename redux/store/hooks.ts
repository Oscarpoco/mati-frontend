import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// 🔹 CUSTOM DISPATCH HOOK (USE INSTEAD OF useDispatch)
export const useAppDispatch: () => AppDispatch = useDispatch;

// 🔹 CUSTOM SELECTOR HOOK (USE INSTEAD OF useSelector)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
