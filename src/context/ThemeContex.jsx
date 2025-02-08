// ThemeContext.js
import React, { createContext, useContext } from "react";

// Define your color palette
const colors = {
  lavenderWeb: "#eeeeffff",
  powderBlue: "#9fb4c7ff",
  ultraViolet: "#545677ff",
  oxfordBlue: "#03254eff",
  richBlack: "#011c27ff",
};

// Create the context
const ThemeContext = createContext(colors);

// Create a custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// Create the provider component
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>
  );
};