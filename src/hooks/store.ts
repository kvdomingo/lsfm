import {
  TypedUseSelectorHook,
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector,
} from "react-redux";

import { AppDispatch, RootState } from "../store/store.ts";

export const useDispatch: () => AppDispatch = useDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;
