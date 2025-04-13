import React from 'react';

// This is a helper component to avoid "window is not defined" errors
// when using ApexCharts in a Next.js environment
export default function FixedDynamicImport({ children }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : null;
}
