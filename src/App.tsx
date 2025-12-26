import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import PublicWebsite from './components/PublicWebsite';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './components/admin/AdminLogin';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<PublicWebsite />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;


