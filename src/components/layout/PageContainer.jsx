import React from "react";

/**
 * Container component that provides consistent width constraints for page content
 */
export default function PageContainer({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ${className}`}>
        {children}
      </div>
    </div>
  );
}
