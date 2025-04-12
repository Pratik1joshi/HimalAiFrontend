import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-100vw flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Main content - Navbar is now in App.jsx */}
      <main className="w-full flex-grow pt-0"> {/* Added padding-top to account for navbar */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-0">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 mt-auto">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HimalAi Finance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
