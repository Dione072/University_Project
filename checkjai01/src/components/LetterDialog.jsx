import { Dialog, DialogOverlay, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function LetterDialog({ open, onOpenChange, title, message }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay onClick={() => onOpenChange?.(false)}>
        <DialogContent>
          <span className="absolute -top-3.5 left-6 bg-[#f2c3c8] text-white text-[11px] px-2.5 py-1 rounded-full tracking-wide">
            for you
          </span>
          <button
            type="button"
            className="absolute top-2.5 right-3 text-[#8a8a8a] hover:text-[#555] text-xl"
            onClick={() => onOpenChange?.(false)}
            aria-label="ปิดจดหมาย"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl mt-2 mb-2 pr-8">{title}</h3>
          <p className="text-sm leading-relaxed mb-4 whitespace-pre-line">{message}</p>
          <Button
            className="bg-[#f4a4ae] hover:bg-[#f18b98] text-white rounded-full"
            onClick={() => onOpenChange?.(false)}
          >
            ปิดจดหมาย
          </Button>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  )
}
