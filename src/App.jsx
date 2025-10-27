import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CertEngine from './pages/CertEngine';
import Admin from './pages/Admin';

const App = () => (
  <AuthProvider>
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--gray))',
            color: 'hsl(var(--text-black))',
            border: '2px solid hsl(var(--border-black))',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            fontWeight: 500,
            fontSize: '1rem',
            letterSpacing: '0.01em',
            borderRadius: '0.75rem',
            padding: '1rem 1.5rem',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
            style: {
              background: '#22c55e',
              color: '#fff',
              border: '2px solid #22c55e',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#ef4444',
              color: '#fff',
              border: '2px solid #ef4444',
            },
          },
          loading: {
            iconTheme: {
              primary: '#facc15',
              secondary: '#222',
            },
            style: {
              background: '#facc15',
              color: '#222',
              border: '2px solid #facc15',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<CertEngine />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
