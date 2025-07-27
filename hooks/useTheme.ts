"use client"

import { useTheme as useNextTheme } from "next-themes"

/**
 * Custom hook for accessing and manipulating the current theme
 * Wraps next-themes useTheme hook with additional functionality
 */
export function useTheme() {
  const { theme, setTheme, themes, systemTheme } = useNextTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const isDarkMode = theme === "dark" || (theme === "system" && systemTheme === "dark")

  return {
    theme,
    setTheme,
    themes,
    systemTheme,
    toggleTheme,
    isDarkMode,
  }
}
