"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import VoucherManagement from "./pages/admin/VoucherManagement";
import Vouchers from "./pages/Vouchers";
import { Toaster } from "./components/ui/toaster";

// Normal user protected route
function ProtectedRoute({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Get fresh user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Use both currentUser from context and storedUser from localStorage
  // This ensures we have the most up-to-date admin status
  const isAdmin = currentUser?.is_admin === true || storedUser.is_admin === true;
  
  console.log("ProtectedRoute - User info:", {
    currentUserAdmin: currentUser?.is_admin,
    storedUserAdmin: storedUser.is_admin,
    finalIsAdmin: isAdmin
  });
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect admins to /admin
  if (isAdmin) {
    console.log("User is admin, redirecting to admin panel from ProtectedRoute");
    return <Navigate to="/admin" replace />;
  }
  
  return children;
}

// Admin protected route
function AdminRoute({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Get fresh user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Use both currentUser from context and storedUser from localStorage
  const isAdmin = currentUser?.is_admin === true || storedUser.is_admin === true;
  
  console.log("AdminRoute - User info:", {
    currentUserAdmin: currentUser?.is_admin,
    storedUserAdmin: storedUser.is_admin,
    finalIsAdmin: isAdmin
  });
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect normal users to /dashboard
  if (!isAdmin) {
    console.log("User is not admin, redirecting to dashboard from AdminRoute");
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Root route component to handle initial routing based on auth status
function RootRoute() {
  const { currentUser, isAuthenticated } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser?.is_admin === true || storedUser.is_admin === true;
  
  console.log("Root route - redirecting based on:", { isAuthenticated, isAdmin });
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
}

function App() {
  return (
    <>
      <Routes>
        {/* Root path - determine where to go based on auth status */}
        <Route path="/" element={<RootRoute />} />
        
        {/* Add a home route that redirects to dashboard or login based on auth */}
        <Route path="/home" element={
          <Layout>
            <Navigate to="/dashboard" replace />
          </Layout>
        } />

        {/* Public routes - now with Layout */}
        <Route path="/login" element={
          <Layout>
            <Login />
          </Layout>
        } />
        <Route path="/signup" element={
          <Layout>
            <Signup />
          </Layout>
        } />
        <Route path="/verify-email" element={
          <Layout>
            <VerifyEmail />
          </Layout>
        } />
        
        {/* Normal user routes */}
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
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/vouchers" element={
          <ProtectedRoute>
            <Layout>
              <Vouchers />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Index route - shown at /admin */}
          <Route index element={<AdminDashboard />} />
          
          {/* Child routes - shown in the Outlet of AdminLayout */}
          <Route path="users" element={<UserManagement />} />
          <Route path="vouchers" element={<VoucherManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
