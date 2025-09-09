
import React, { createContext, useContext } from "react";

// We create a simple context just to maintain compatibility with existing code
interface ThemeContextType {
  theme: "light";
  toggleTheme: () => void; // This function won't do anything now
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Always light theme
  const theme = "light";

  // This function is kept for compatibility but doesn't do anything
  const toggleTheme = () => {
    // No-op function since we're removing dark mode
    console.log("Dark mode has been removed from the application");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
