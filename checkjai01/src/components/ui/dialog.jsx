import * as React from 'react'
import { cn } from '@/lib/utils'

const Dialog = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onOpenChange?.(false)
    }
    if (open) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onOpenChange])

  if (!open) return null
  return <>{children}</>
}

const DialogOverlay = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'fixed inset-0 z-[999] bg-black/35 flex items-center justify-center p-4',
      className
    )}
    onClick={onClick}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-[1000] bg-[#fffdf7] rounded-[22px] p-6 shadow-xl max-w-[420px] w-full animate-in fade-in zoom-in-95 duration-200 text-[#3a4a63]',
      className
    )}
    onClick={(e) => e.stopPropagation()}
    {...props}
  >
    {children}
  </div>
))
DialogContent.displayName = 'DialogContent'

export { Dialog, DialogOverlay, DialogContent }
