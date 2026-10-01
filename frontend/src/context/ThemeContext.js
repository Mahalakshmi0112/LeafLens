import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

export const APP_CONFIG = {
  appName: "LeafLens",
  subtitle: "AI Crop Disease Detection & Remedies",
  tagline: "Snap a leaf. Get a diagnosis and a plan in seconds.",
};

const ThemeContext = createContext();

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }) => {
  // Read theme preference from localStorage or default to light
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem("leaflens_theme");
      return saved === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  });

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    try {
      localStorage.setItem("leaflens_theme", mode);
    } catch (e) {}
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const muiTheme = useMemo(() => {
    const isDark = mode === "dark";

    return createTheme({
      palette: {
        type: isDark ? "dark" : "light",
        primary: {
          main: isDark ? "#86A789" : "#4F6F52",
          light: isDark ? "#A3C9A8" : "#86A789",
          dark: isDark ? "#3A523C" : "#324834",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#C8694A", // Terracotta accent
          light: "#DC8264",
          dark: "#A34C31",
          contrastText: "#FFFFFF",
        },
        background: {
          default: isDark ? "#161F18" : "#FBF6EC",
          paper: isDark ? "#202C23" : "#FFFFFF",
        },
        text: {
          primary: isDark ? "#EAE3D2" : "#3B2F2F",
          secondary: isDark ? "#B6C0B8" : "#6E6259",
        },
        success: {
          main: "#4F6F52",
          light: "#D2E3C8",
        },
        warning: {
          main: "#D9822B",
          light: "#FDF0D5",
        },
        error: {
          main: "#C8694A",
          light: "#FCE8E2",
        },
      },
      typography: {
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        h1: {
          fontFamily: "'Lora', Georgia, serif",
          fontWeight: 700,
          color: isDark ? "#F5EFE6" : "#2B211E",
        },
        h2: {
          fontFamily: "'Lora', Georgia, serif",
          fontWeight: 600,
          color: isDark ? "#F5EFE6" : "#2B211E",
        },
        h3: {
          fontFamily: "'Lora', Georgia, serif",
          fontWeight: 600,
          color: isDark ? "#F5EFE6" : "#2B211E",
        },
        h4: {
          fontFamily: "'Lora', Georgia, serif",
          fontWeight: 600,
          color: isDark ? "#F5EFE6" : "#2B211E",
        },
        h5: {
          fontFamily: "'Lora', Georgia, serif",
          fontWeight: 600,
          color: isDark ? "#F5EFE6" : "#2B211E",
        },
        h6: {
          fontFamily: "'Lora', Georgia, serif",
          fontWeight: 600,
          color: isDark ? "#F5EFE6" : "#2B211E",
        },
        button: {
          fontWeight: 700,
          textTransform: "none",
          borderRadius: 12,
        },
      },
      shape: {
        borderRadius: 16,
      },
      overrides: {
        MuiButton: {
          root: {
            borderRadius: 14,
            padding: "10px 22px",
            fontSize: "0.95rem",
            fontWeight: 700,
            transition: "all 0.25s ease-in-out",
          },
          containedPrimary: {
            backgroundColor: isDark ? "#4F6F52" : "#4F6F52",
            color: "#FDFBF7",
            boxShadow: "0 4px 14px rgba(79, 111, 82, 0.25)",
            "&:hover": {
              backgroundColor: isDark ? "#618464" : "#3B553E",
              boxShadow: "0 6px 18px rgba(79, 111, 82, 0.35)",
              transform: "translateY(-1px)",
            },
          },
          containedSecondary: {
            backgroundColor: "#C8694A",
            color: "#FFFFFF",
            boxShadow: "0 4px 14px rgba(200, 105, 74, 0.25)",
            "&:hover": {
              backgroundColor: "#B35739",
              transform: "translateY(-1px)",
            },
          },
        },
        MuiCard: {
          root: {
            borderRadius: 20,
            boxShadow: isDark
              ? "0 4px 20px rgba(0, 0, 0, 0.4)"
              : "0 4px 20px rgba(65, 50, 40, 0.07)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(79, 111, 82, 0.1)",
          },
        },
        MuiPaper: {
          rounded: {
            borderRadius: 20,
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, isDark: mode === "dark", toggleTheme, appConfig: APP_CONFIG }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
