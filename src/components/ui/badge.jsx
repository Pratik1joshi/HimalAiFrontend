import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "bg-blue-500 text-white hover:bg-blue-500/80",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
  destructive: "bg-red-500 text-white hover:bg-red-500/80",
  outline: "border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200",
  success: "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
}

function Badge({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", 
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
