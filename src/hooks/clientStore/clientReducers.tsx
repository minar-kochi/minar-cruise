import { useDispatch, useSelector, useStore } from "react-redux";
import {
  ClientAppDispatch,
  ClientAppStore,
  ClientRootState,
} from "@/lib/store/clientStore";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useClientDispatch = useDispatch.withTypes<ClientAppDispatch>();
export const useClientSelector = useSelector.withTypes<ClientRootState>();
export const useClientStore = useStore.withTypes<ClientAppStore>();
