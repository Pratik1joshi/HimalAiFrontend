"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import Analytics from "./pages/Analytics"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import VerifyEmail from "./pages/VerifyEmail"
import { Navbar } from "./components/ui/navbar"
import Layout from "./components/Layout"

// Protected route component
function ProtectedRoute({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated
  if (!currentUser && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      {/* Add universal navbar at the top level - it will show on all pages */}
      <Navbar />
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Protected routes - all using the same Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/upload" element={
          <ProtectedRoute>
            <Layout>
              <Upload />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
        } />
        
        {/* Home route */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard /> {/* Using Dashboard as home for now */}
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Default route - redirect to dashboard if authenticated, otherwise login */}
        <Route path="/" element={<Navigate to="/"/>} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
