import { configureStore } from "@reduxjs/toolkit";
import packageClient from "@/lib/features/client/packageClientSlice";
export const makeClientStore = () => {
  return configureStore({
    devTools: true,
    reducer: {
      package: packageClient,
    },
  });
};

// Infer the type of makeStore

export type ClientAppStore = ReturnType<typeof makeClientStore>;
export type ClientAppDispatch = ClientAppStore["dispatch"];
// Infer the `RootState` and `AppDispatch` types from the store itself
export type ClientRootState = ReturnType<ClientAppStore["getState"]>;
