"use client"

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="mx-auto px-8 sm:px-10 w-full lm:px-12 xl:px-26 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">FinTrack</Link>
        
        {/* Mobile menu button */}
        <button 
          className="sm:hidden focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-blue-600">Dashboard</Link>
              <Link to="/upload" className="text-sm font-medium hover:text-blue-600">Upload</Link>
              <Link to="/analytics" className="text-sm font-medium hover:text-blue-600">Analytics</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-blue-600">Login</Link>
              <Link to="/signup" className="text-sm font-medium hover:text-blue-600">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
      
      {/* Mobile menu - slides in from right, auto height */}
      <div 
        className={`fixed top-0 right-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out rounded-bl-lg ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button 
            onClick={toggleMenu} 
            className="focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col py-2">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium px-6 py-3 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/upload" 
                className="text-sm font-medium px-6 py-3 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Upload
              </Link>
              <Link 
                to="/analytics" 
                className="text-sm font-medium px-6 py-3 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-medium px-6 py-3 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-sm font-medium px-6 py-3 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
