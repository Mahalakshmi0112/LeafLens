import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { AppThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Library from "./pages/Library";
import { MODEL_TO_CROP } from "./data/diseases";

// Backward-compatibility wrapper for older model routes
const LegacyModelRedirect = () => {
  const { selectedModel } = useParams();
  const crop = MODEL_TO_CROP[selectedModel] || "tomato";
  return <Navigate to={`/scan/${crop}`} replace />;
};

function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main style={{ flex: "1 0 auto" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/scan/:crop" element={<Scan />} />
              <Route path="/history" element={<History />} />
              <Route path="/library" element={<Library />} />

              {/* Backward compatibility with legacy routes */}
              <Route path="/model-selection" element={<Navigate to="/" replace />} />
              <Route path="/image-upload/:selectedModel" element={<LegacyModelRedirect />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
