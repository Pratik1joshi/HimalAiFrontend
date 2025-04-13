import { useState, useEffect } from "react"

const TOAST_TIMEOUT = 5000 // 5 seconds

export function useToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const timers = []
    
    toasts.forEach(toast => {
      if (toast.open) {
        const timer = setTimeout(() => {
          setToasts(prevToasts => 
            prevToasts.map(t => 
              t.id === toast.id ? { ...t, open: false } : t
            )
          )
        }, TOAST_TIMEOUT)
        
        timers.push(timer)
      }
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [toasts])

  const toast = ({ title, description, variant = "default", duration = TOAST_TIMEOUT }) => {
    const id = Math.random().toString(36).slice(2, 11)
    
    setToasts(prevToasts => [
      ...prevToasts,
      {
        id,
        title,
        description,
        variant,
        duration,
        open: true,
      },
    ])
    
    return {
      id,
      dismiss: () => {
        setToasts(prevToasts => 
          prevToasts.map(t => 
            t.id === id ? { ...t, open: false } : t
          )
        )
      },
    }
  }

  const dismiss = (toastId) => {
    setToasts(prevToasts => 
      prevToasts.map(t => 
        t.id === toastId ? { ...t, open: false } : t
      )
    )
  }

  const dismissAll = () => {
    setToasts(prevToasts => 
      prevToasts.map(t => ({ ...t, open: false }))
    )
  }

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  }
}

export default useToast;
