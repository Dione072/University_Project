import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const LOGIN_ERROR_MSG = 'Username หรือ Password ของท่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // ถ้าล็อกอินอยู่แล้ว ให้ไปหน้า Home
  if (user) {
    return <Navigate to="/" replace />
  }

  const clearErrors = () => setErrors({})

  const handleLogin = async () => {
    clearErrors()
    if (!username.trim() || !password.trim()) {
      setErrors({
        username: LOGIN_ERROR_MSG,
        password: LOGIN_ERROR_MSG,
      })
      return
    }

    setLoading(true)
    try {
      if (!supabase) {
        setErrors({ username: LOGIN_ERROR_MSG, password: LOGIN_ERROR_MSG })
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('students')
        .select('student_id, full_name_th')
        .eq('student_id', username.trim())
        .eq('password', password.trim())
        .maybeSingle()

      if (error) {
        setErrors({ username: LOGIN_ERROR_MSG, password: LOGIN_ERROR_MSG })
        setLoading(false)
        return
      }

      if (!data) {
        setErrors({ username: LOGIN_ERROR_MSG, password: LOGIN_ERROR_MSG })
        setLoading(false)
        return
      }

      login({
        username: data.student_id,
        name: data.full_name_th || data.student_id,
      })
      navigate('/')
    } catch {
      setErrors({ username: LOGIN_ERROR_MSG, password: LOGIN_ERROR_MSG })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 bg-[#f7f7f7]">
      <section className="bg-[#cbe9ff] w-full max-w-[540px] rounded-lg py-14 px-12 md:px-20 shadow-lg">
        <h1 className="flex items-center justify-center gap-4 mb-10 font-medium text-lg">
          <span className="flex-1 border-b border-[#7ca3c3] mx-4" />
          <span>เข้าสู่ระบบ</span>
          <span className="flex-1 border-b border-[#7ca3c3] mx-4" />
        </h1>

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-xs text-[#555] mb-1.5">
              Username :
            </label>
            <div className={cn('rounded-full flex items-center h-11 px-4 bg-white border-2 shadow-sm', errors.username && 'border-red-500')}>
              <span className="mr-1.5 text-[17px]">👤</span>
              <Input
                id="username"
                type="text"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-0 shadow-none bg-transparent focus-visible:ring-0"
              />
            </div>
            {errors.username && <p className="text-[11px] text-red-600 mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-[#555] mb-1.5">
              Password :
            </label>
            <div className={cn('rounded-full flex items-center h-11 px-4 bg-white border-2 shadow-sm', errors.password && 'border-red-500')}>
              <span className="mr-1.5 text-[17px]">🔒</span>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 shadow-none bg-transparent flex-1 focus-visible:ring-0"
              />
              <button
                type="button"
                className="ml-1.5 text-base"
                onClick={() => setShowPassword((s) => !s)}
                title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link to="/forgot-password" className="text-[11px] text-[#6c8292] hover:underline">
                ลืมรหัสผ่าน ?
              </Link>
            </div>
            {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 mt-8">
          <Button
            className="w-[220px] h-11 bg-[#74c4df] hover:bg-[#74c4df]/90 text-white shadow"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </Button>
          <Link to="/register">
            <Button variant="secondary" className="w-[220px] h-11 bg-[#2f7c96] hover:bg-[#2f7c96]/90 text-white shadow">
              สมัครสมาชิก
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
