import * as React from "react"
import { cn } from "../../lib/utils"

const DropdownMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null }
})

function DropdownMenu({ children }) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef(null)
  
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext)
  
  // Merge refs
  React.useImperativeHandle(ref, () => triggerRef.current)
  
  return React.cloneElement(asChild ? React.Children.only(props.children) : <button {...props} />, {
    ref: triggerRef,
    onClick: (e) => {
      setOpen(!open)
      props.onClick?.(e)
    },
    className: asChild ? undefined : cn("focus:outline-none", className)
  })
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext)
  const contentRef = React.useRef(null)
  
  // Calculate position function - defined outside of any conditionals
  const updatePosition = () => {
    if (!contentRef.current || !triggerRef.current) return
    
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    
    let top = triggerRect.bottom + sideOffset
    let left = triggerRect.left
    
    if (align === "end") {
      left = triggerRect.right - contentRect.width
    } else if (align === "center") {
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
    }
    
    // Prevent overflow
    if (left < 10) left = 10
    if (left + contentRect.width > window.innerWidth - 10) {
      left = window.innerWidth - contentRect.width - 10
    }
    
    contentRef.current.style.top = `${top}px`
    contentRef.current.style.left = `${left}px`
  }
  
  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open && 
        contentRef.current && 
        !contentRef.current.contains(event.target) && 
        triggerRef.current && 
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen, triggerRef])
  
  // Close on ESC key
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener("keydown", handleEsc)
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc)
    }
  }, [open, setOpen])
  
  // Position update effect
  React.useLayoutEffect(() => {
    if (open && contentRef.current) {
      // Delay position update to allow browser to render dropdown first
      setTimeout(updatePosition, 0)
      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition)
    }
    
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [open, align, sideOffset, triggerRef])
  
  // Handle merging ref
  const handleRef = (el) => {
    contentRef.current = el
    if (typeof ref === "function") ref(el)
    else if (ref) ref.current = el
  }
  
  if (!open) return null
  
  return (
    <div
      ref={handleRef}
      style={{ position: "fixed" }} // Ensure position is fixed
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md animate-in fade-in-80 dark:border-gray-800 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext)
  
  // Fix DOM nesting error: Don't clone if asChild and the child is an <a> tag
  if (asChild) {
    const child = React.Children.only(props.children);
    // Merge the onClick handler to ensure dropdown closes
    const enhancedProps = {
      ...child.props,
      onClick: (e) => {
        if (child.props.onClick) child.props.onClick(e);
        setOpen(false);
      },
      className: cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
        child.props.className,
        className
      )
    };
    
    return React.cloneElement(child, enhancedProps);
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
        className
      )}
      onClick={(e) => {
        setOpen(false);
        props.onClick?.(e);
      }}
      type="button"
      {...props}
    >
      {props.children}
    </button>
  );
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-800", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
}
