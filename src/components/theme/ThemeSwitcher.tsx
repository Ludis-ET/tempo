import { useThemeProvider } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeSwitcher = () => {
  const { mode, toggleMode } = useThemeProvider();
  return (
    <div className="flex items-center">
      <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleMode}>
        {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
};
