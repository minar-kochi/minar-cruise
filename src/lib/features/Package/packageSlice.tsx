// import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export type TOrganizedPackage = Exclude<TgetPackageScheduleDatas, null>;

export type TPackageState = {
  OrganizedPackage: TExcludedOrganizedPackageData;
};

const scheduleSlice = createSlice({
  name: "package",
  initialState: {} as TPackageState,
  reducers: {
    setOrganizedPackage(
      state,
      action: PayloadAction<TExcludedOrganizedPackageData>
    ) {
      state.OrganizedPackage = action.payload;
    },
  },
});

export const { setOrganizedPackage } = scheduleSlice.actions;
export default scheduleSlice.reducer;
