"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    // This is a mock login - in a real app, you would call your API
    const mockUser = {
      id: "1",
      name: "Demo User",
      email: email,
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    return mockUser
  }

  // Signup function
  const signup = async (name, email, password) => {
    // This is a mock signup - in a real app, you would call your API
    const mockUser = {
      id: "1",
      name: name,
      email: email,
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    return mockUser
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
