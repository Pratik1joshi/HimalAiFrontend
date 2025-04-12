"use client"

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">FinTrack</Link>
        
        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-blue-600">Dashboard</Link>
                <Link to="/upload" className="text-sm font-medium hover:text-blue-600">Upload</Link>
                <Link to="/analytics" className="text-sm font-medium hover:text-blue-600">Analytics</Link>
              </>
            ) : (
              <></>
            )}
          </nav>
          
          {/* Profile dropdown or login buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <User className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.name || user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="sm:hidden focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
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
              <div className="border-t my-2"></div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="text-sm font-medium px-6 py-3 text-left text-red-600 hover:bg-gray-100 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
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
