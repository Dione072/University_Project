import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="w-full h-14 bg-[#315c7e] flex items-center justify-center shadow-md fixed top-0 left-0 z-10 px-5">
      <Link to="/" className="text-white text-xl font-medium tracking-widest">
        CheckJai
      </Link>

      <button
        type="button"
        className="absolute right-5 top-1/2 -translate-y-1/2 text-white p-1"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="เมนู"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={cn(
          'absolute top-14 right-0 w-56 bg-[#7ea4c2] py-6 px-5 shadow-lg text-center transition-all',
          menuOpen ? 'block' : 'hidden'
        )}
      >
        {user ? (
          <>
            <Link
              to="/profile"
              className="block text-white py-2 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              ข้อมูลส่วนตัว
            </Link>
            <hr className="border-white/50 my-2" />
            <Link
              to="/history"
              className="block text-white py-2 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              ประวัติการทำแบบทดสอบ
            </Link>
            <hr className="border-white/50 my-2" />
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 w-full"
              onClick={() => {
                logout()
                setMenuOpen(false)
              }}
            >
              ออกจากระบบ
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="block text-white py-2 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              เข้าสู่ระบบ
            </Link>
            <hr className="border-white/50 my-2" />
            <Link
              to="/register"
              className="block text-white py-2 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
