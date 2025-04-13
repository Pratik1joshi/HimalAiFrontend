import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      {children}
    </div>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("block truncate", className)}
      {...props}
    />
  )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-80 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        className
      )}
      {...props}
    >
      <div className="w-full p-1">
        {children}
      </div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      </span>
      <span className="text-sm">{children}</span>
    </button>
  )
})
SelectItem.displayName = "SelectItem"

const SelectGroup = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-1 w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SelectGroup.displayName = "SelectGroup"

const SelectLabel = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SelectLabel.displayName = "SelectLabel"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
}
