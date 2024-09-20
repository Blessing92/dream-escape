import React, {
  createContext,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react"
import { useLocalStorageState } from "../hooks/useLocalStorageState"

interface DarkModeContextValue {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

interface DarkModeProviderProps {
  children: React.ReactNode
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(
  undefined,
)

function DarkModeProvider({ children }: DarkModeProviderProps) {
  const defaultMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    defaultMode,
    "isDarkMode",
  )

  useEffect(
    function applyDarkModeClass() {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode")
        document.documentElement.classList.remove("light-mode")
      } else {
        document.documentElement.classList.add("light-mode")
        document.documentElement.classList.remove("dark-mode")
      }
    },
    [isDarkMode],
  )

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((isDark: boolean) => !isDark)
  }, [setIsDarkMode])

  const value = useMemo(
    () => ({ isDarkMode, toggleDarkMode }),
    [isDarkMode, toggleDarkMode],
  )

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  )
}

function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider")
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { DarkModeProvider, useDarkMode }
