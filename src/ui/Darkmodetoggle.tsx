import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    // Otherwise check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 py-2"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {/* Sun icon - shows in dark mode */}

      {!isDark && (
        <Icon
          name="light_mode"
          size={20}
          className="text-slate-400 hidden dark:block "
        />
      )}

      {/* Moon icon - shows in light mode */}
      {isDark && (
        <Icon
          name="dark_mode"
          size={20}
          className="text-slate-400 block dark:hidden"
        />
      )}
    </button>
  );
}
