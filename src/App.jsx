"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import Analytics from "./pages/Analytics"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { Navbar } from "./components/ui/navbar"

// Protected route component
function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Layout component to wrap all pages
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col w-[calc(100vw-1px)] md:w-[calc(100vw-1px)] lg:w-[calc(100vw-3px)] xl:w-[calc(100vw-3px)] 2xl:w-[calc(100vw-px)] overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="mx-auto px-8 w-full">{children}</div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Layout>
              <Upload />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
