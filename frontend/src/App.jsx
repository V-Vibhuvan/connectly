import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import Home from "./pages/home";
import History from "./pages/history";
import VideoMeet from "./pages/VideoMeet";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/auth" element={<Authentication />} />

          {/* Home */}
          <Route path="/home" element={<Home />} />

          {/* History */}
          <Route path="/history" element={<History />} />

          {/* Video Call */}
          <Route path="/:meetingCode" element={<VideoMeet />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;