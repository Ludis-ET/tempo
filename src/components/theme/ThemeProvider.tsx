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

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEYS.mode) as ThemeMode | null;
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore storage errors
  }
  return "light";
}

function readStoredPalette(): ThemePalette {
  if (typeof window === "undefined") return "slate";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEYS.palette) as ThemePalette | null;
    if (saved === "slate" || saved === "emerald" || saved === "indigo" || saved === "amber") return saved;
  } catch {
    // ignore storage errors
  }
  return "slate";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const initial = readStoredMode();
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", initial === "dark");
    }
    return initial;
  });
  const [palette, setPalette] = useState<ThemePalette>(() => {
    const initial = readStoredPalette();
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", initial);
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.mode, mode);
    }
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.palette, palette);
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", palette);
    }
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
