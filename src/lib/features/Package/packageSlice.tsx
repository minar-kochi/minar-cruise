// import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export type TOrganizedPackage = Exclude<TgetPackageScheduleDatas, null>;

export type TPackageState = {
  OrganizedPackage: TExcludedOrganizedPackageData;
};

const packageSlice = createSlice({
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

export const { setOrganizedPackage } = packageSlice.actions;
export default packageSlice.reducer;
