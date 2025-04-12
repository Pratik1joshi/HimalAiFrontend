"use client"

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X, User, LogOut, BarChart3, Home, Upload } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user's first name if available
  const userDisplayName = currentUser?.first_name || 
                          (currentUser?.email ? currentUser.email.split('@')[0] : 'User');

  // Helper to check if the link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };
  
  // Active link style
  const activeLinkClass = "text-blue-600 dark:text-blue-400 font-medium";
  const linkClass = "text-sm font-medium hover:text-blue-600 transition-colors";

  return (
    <header className={`sticky top-0 w-full bg-white dark:bg-gray-800 border-b z-30 transition-shadow duration-200 ${
      scrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span>FinTrack</span>
        </Link>
        
        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {currentUser && (
              <>
                <Link 
                  to="/dashboard" 
                  className={isActiveLink('/dashboard') ? activeLinkClass : linkClass}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/upload" 
                  className={isActiveLink('/upload') ? activeLinkClass : linkClass}
                >
                  Upload
                </Link>
                <Link 
                  to="/analytics" 
                  className={isActiveLink('/analytics') ? activeLinkClass : linkClass}
                >
                  Analytics
                </Link>
              </>
            )}
          </nav>
          
          {/* Profile dropdown or login buttons */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 dark:hover:bg-opacity-40 transition-colors">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{userDisplayName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {currentUser.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
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
          className="sm:hidden focus:outline-none text-gray-700 dark:text-gray-300" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={toggleMenu}
        ></div>
      )}
      
      {/* Mobile menu - slides in from right */}
      <div 
        className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            {currentUser && (
              <>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{userDisplayName}</span>
              </>
            )}
            {!currentUser && <span className="font-bold">Menu</span>}
          </div>
          <button 
            onClick={toggleMenu} 
            className="focus:outline-none text-gray-700 dark:text-gray-300"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col py-2">
          {currentUser ? (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center text-sm px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActiveLink('/dashboard') ? 'text-blue-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link 
                to="/upload" 
                className={`flex items-center text-sm px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActiveLink('/upload') ? 'text-blue-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Link>
              <Link 
                to="/analytics" 
                className={`flex items-center text-sm px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActiveLink('/analytics') ? 'text-blue-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
              <div className="border-t my-2 dark:border-gray-700"></div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="text-sm px-6 py-3 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-sm px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
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
