import ScheduleSlice from "../features/schedule/ScheduleSlice";
import PackageSlice from "../features/Package/packageSlice";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
  return configureStore({
    devTools: true,
    reducer: {
      schedule: ScheduleSlice,
      package: PackageSlice,
    },
  });
};

// Infer the type of makeStore

export type AppDispatch = AppStore["dispatch"];

export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
