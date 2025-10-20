
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BatchEditingProvider } from './contexts/BatchEditingContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Example from './pages/Example';
import ProfileSettings from './pages/ProfileSettings';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <BatchEditingProvider>
          <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              style: { 
                background: 'hsl(var(--success))', 
                color: 'hsl(var(--success-foreground))',
                border: '1px solid hsl(var(--success))'
              },
              iconTheme: { 
                primary: 'hsl(var(--success-foreground))', 
                secondary: 'hsl(var(--success))' 
              },
            },
            error: {
              style: { 
                background: 'hsl(var(--error))', 
                color: 'hsl(var(--error-foreground))',
                border: '1px solid hsl(var(--error))'
              },
              iconTheme: { 
                primary: 'hsl(var(--error-foreground))', 
                secondary: 'hsl(var(--error))' 
              },
            },
            loading: {
              style: { 
                background: 'hsl(var(--info))', 
                color: 'hsl(var(--info-foreground))',
                border: '1px solid hsl(var(--info))'
              },
            },
          }} 
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Example />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/example"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Example />
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
            element={<Navigate to="/" replace />}
          />
        </Routes>
          </Router>
        </BatchEditingProvider>
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
