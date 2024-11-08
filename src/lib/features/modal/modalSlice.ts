// import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export type TOrganizedPackage = Exclude<TgetPackageScheduleDatas, null>;

export type TModalState = {
  isModalOpen: boolean;
};

const modalSlice = createSlice({
  name: "modal-slice",
  initialState: {
    isModalOpen: false,
  } as TModalState,
  reducers: {
    setIsModalOpen(state, action: PayloadAction<{ open: boolean }>) {
      state.isModalOpen = action.payload.open;
    },
    setIsModalToggle(state) {
      state.isModalOpen = !state.isModalOpen;
    },
  },
});

export const { setIsModalOpen, setIsModalToggle } = modalSlice.actions;
export default modalSlice.reducer;
