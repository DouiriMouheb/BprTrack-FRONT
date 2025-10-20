
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ProfileSettings from './pages/ProfileSettings';
import CertEngine from './pages/CertEngine';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
    
       
          <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--panel))',
              color: 'hsl(var(--text))',
              border: '2px solid hsl(var(--accent))',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              fontWeight: 500,
              fontSize: '1rem',
              letterSpacing: '0.01em',
              borderRadius: '0.75rem',
              padding: '1rem 1.5rem',
            },
            success: {
              iconTheme: {
                primary: '#22c55e', // green
                secondary: 'hsl(var(--panel))',
              },
              style: {
                background: '#22c55e', // green
                color: '#fff',
                border: '2px solid #22c55e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // red
                secondary: 'hsl(var(--panel))',
              },
              style: {
                background: '#ef4444', // red
                color: '#fff',
                border: '2px solid #ef4444',
              },
            },
            loading: {
              iconTheme: {
                primary: '#facc15', // yellow
                secondary: 'hsl(var(--panel))',
              },
              style: {
                background: '#facc15', // yellow
                color: '#222',
                border: '2px solid #facc15',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Example page removed */}
          <Route
            path="/cert-engine"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CertEngine />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfileSettings />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          {/* Catch-all route - redirect to home */}
          <Route
            path="*"
            element={<Navigate to="/cert-engine" replace />}
          />
        </Routes>
          </Router>
      
      
    </AuthProvider>
  </ThemeProvider>
);

export default App;
