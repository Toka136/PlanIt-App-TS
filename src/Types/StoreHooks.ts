import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../API/Store";

export const UseAppSelector:TypedUseSelectorHook<RootState>=useSelector
export const UseAppDispatch:()=>AppDispatch=useDispatch