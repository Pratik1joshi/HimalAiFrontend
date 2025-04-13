import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import ReactDOM from "react-dom";

// Simple implementation that doesn't require @radix-ui/react-dialog
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return <>{children}</>;
};

const DialogTrigger = React.forwardRef(({ children, onClick, ...props }, ref) => {
  return (
    <button ref={ref} onClick={onClick} {...props}>
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";

const DialogOverlay = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    onClick={onClick}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// Portal component using ReactDOM
const Portal = ({ children, container }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted
    ? ReactDOM.createPortal(children, container || document.body)
    : null;
};

const DialogContent = React.forwardRef(({ className, children, onOpenChange, ...props }, ref) => (
  <Portal>
    <DialogOverlay onClick={() => onOpenChange?.(false)} />
    <div
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 sm:rounded-lg dark:border-gray-800 dark:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
      <button
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        onClick={() => onOpenChange?.(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  </Portal>
));

DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
));

DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
));

DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));

DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
