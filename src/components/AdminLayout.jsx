import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Shield, Users, Gift, BarChart2, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Fix path for user management
  const navItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: <BarChart2 size={20} /> },
    { label: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
    { label: 'Voucher Management', path: '/admin/vouchers', icon: <Gift size={20} /> },
    { label: 'System Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Sidebar with distinctive styling */}
      <div className="w-64 bg-gray-900 text-white shadow-md">
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <Link to="/admin" className="font-bold text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span>FinTrack</span>
        </Link>
        </div>
        
        {/* Navigation - ADMIN ONLY PAGES */}
        <div className="py-4">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </p>
          </div>
          
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 ${
                isActiveRoute(item.path)
                  ? 'bg-purple-900 border-l-4 border-purple-500 text-purple-300'
                  : 'hover:bg-gray-800'
              }`}
            >
              {React.cloneElement(item.icon, {
                className: `${isActiveRoute(item.path) ? 'text-purple-300' : 'text-gray-400'}`
              })}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
          
          {/* Return to user dashboard */}
          <div className="px-4 py-2 mt-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </p>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800"
          >
            <Home size={20} />
            <span className="ml-3">User Dashboard</span>
          </Link>
          
          {/* Logout */}
          <div className="px-4 py-2 mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-800"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin header with distinct styling */}
        <header className="bg-gray-900 text-white shadow-sm h-16 flex items-center px-6 justify-between">
        <div className="flex items-center justify-center h-16">
          <Link to="/admin" className="flex items-center px-4">
            <Shield className="w-6 h-6 text-purple-400" />
            <span className="ml-2 text-lg font-bold">Admin Panel</span>
          </Link>
        </div>
          <div className="flex items-center">
            {currentUser && (
              <div className="flex items-center">
                <div className="text-sm text-right mr-4">
                  <p className="font-medium">{currentUser.first_name} {currentUser.last_name}</p>
                  <p className="text-xs text-purple-300">Administrator</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {currentUser.first_name?.[0]}{currentUser.last_name?.[0]}
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Content - Replace children with Outlet */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
