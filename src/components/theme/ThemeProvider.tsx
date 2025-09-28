import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";
export type ThemePalette = "slate" | "emerald" | "indigo" | "amber";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  palette: ThemePalette;
  setPalette: (p: ThemePalette) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  mode: "erp:theme-mode",
  palette: "erp:theme-palette",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.mode) as ThemeMode | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [palette, setPalette] = useState<ThemePalette>(() => {
    return (localStorage.getItem(STORAGE_KEYS.palette) as ThemePalette | null) ?? "slate";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mode, mode);
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.palette, palette);
    const root = document.documentElement;
    root.setAttribute("data-theme", palette);
  }, [palette]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, palette, setPalette, toggleMode: () => setMode((m) => (m === "dark" ? "light" : "dark")) }),
    [mode, palette],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeProvider() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeProvider must be used within ThemeProvider");
  return ctx;
}
