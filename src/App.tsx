import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { StatusPage } from './pages/StatusPage';
import { DashboardPage } from './pages/DashboardPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/status/:id" element={<StatusPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;