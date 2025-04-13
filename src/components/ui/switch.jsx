import * as React from "react";
import { cn } from "../../lib/utils";

// Simple switch component that doesn't require any external dependencies
export const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const handleToggle = (e) => {
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
        className
      )}
      ref={ref}
      onClick={handleToggle}
      {...props}
    >
      <span 
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
});

Switch.displayName = "Switch";
