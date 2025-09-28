import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UISliceState = {
  sidebarCollapsed: boolean;
  themePalette: "slate" | "emerald" | "indigo" | "amber";
};

const initialState: UISliceState = {
  sidebarCollapsed: false,
  themePalette: "slate",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setThemePalette(state, action: PayloadAction<UISliceState["themePalette"]>) {
      state.themePalette = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebar, setThemePalette } = uiSlice.actions;
export default uiSlice.reducer;
