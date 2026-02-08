import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

/** โยงกับ Table: full_name_th, student_id, faculty, major, year_level, password */
const TABLE_NAME = 'students'

const initialForm = {
  full_name_th: '',   // ชื่อ - นามสกุล (ภาษาไทย)
  student_id: '',     // รหัสประจำตัวนักศึกษา
  faculty: '',        // คณะ
  major: '',          // สาขา / วิชา
  year_level: '',     // ชั้นปีที่ศึกษา
  password: '',
  confirm_password: '',
}

const formRows = [
  { name: 'full_name_th', label: 'ชื่อ - นามสกุล (ภาษาไทย) :', type: 'text' },
  { name: 'student_id', label: 'รหัสประจำตัวนักศึกษา :', type: 'text' },
  { name: 'faculty', label: 'คณะ :', type: 'text' },
  { name: 'major', label: 'สาขา / วิชา :', type: 'text' },
  { name: 'year_level', label: 'ชั้นปีที่ศึกษา :', type: 'text' },
]

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
    setSubmitError('')
  }

  const validate = () => {
    const e = {}
    const pass = form.password.trim()
    const confirm = form.confirm_password.trim()
    if (!pass) e.password = 'กรุณากรอกรหัสผ่าน'
    else {
      const lengthOk = pass.length >= 8 && pass.length <= 12
      const hasUpper = /[A-Z]/.test(pass)
      const hasLower = /[a-z]/.test(pass)
      const hasDigit = /[0-9]/.test(pass)
      if (!(lengthOk && hasUpper && hasLower && hasDigit)) {
        e.password = 'รหัสผ่านต้องมีความยาว 8–12 ตัวอักษร และประกอบด้วย ตัวพิมพ์ใหญ่ (A–Z), ตัวพิมพ์เล็ก (a–z), ตัวเลข (0–9)'
      }
    }
    if (!confirm) e.confirm_password = 'กรุณากรอกยืนยันรหัสผ่าน'
    else if (pass !== confirm) e.confirm_password = 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setSubmitError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const row = {
        full_name_th: form.full_name_th.trim(),
        student_id: form.student_id.trim(),
        faculty: form.faculty.trim(),
        major: form.major.trim(),
        year_level: form.year_level.trim(),
        password: form.password.trim(),
      }

      if (supabase) {
        const { error } = await supabase.from(TABLE_NAME).insert(row)
        if (error) {
          setSubmitError(error.message || 'บันทึกข้อมูลไม่สำเร็จ')
          setSubmitting(false)
          return
        }
      }

      login({
        username: form.student_id.trim() || form.full_name_th.trim(),
        name: form.full_name_th.trim(),
      })
      navigate('/')
    } catch (err) {
      setSubmitError(err.message || 'เกิดข้อผิดพลาด')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-8 bg-[#f7f7f7]">
      <section className="bg-[#cbe9ff] w-full max-w-[820px] rounded-lg py-12 px-8 md:px-14 shadow-lg">
        <h1 className="flex items-center justify-center gap-4 mb-2 font-medium text-xl">
          <span className="flex-1 border-b border-[#7ca3c3] mx-4" />
          <span>สมัครสมาชิก</span>
          <span className="flex-1 border-b border-[#7ca3c3] mx-4" />
        </h1>
        <p className="text-center text-[13px] text-[#4b5f70] mb-6">
          ยืนยันตัวตนด้วย Google สำเร็จแล้ว เหลืออีกนิดเดียว กรอกข้อมูลนักศึกษาเพื่อสมัครสมาชิก
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formRows.map(({ name, label, type }) => (
            <div key={name} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <label htmlFor={name} className="md:w-[190px] md:text-right text-sm text-[#233343] shrink-0">
                {label}
              </label>
              <div className="flex-1">
                <Input
                  id={name}
                  type={type}
                  value={form[name]}
                  onChange={(e) => update(name, e.target.value)}
                  className="h-9 rounded-md"
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <label htmlFor="password" className="md:w-[190px] md:text-right text-sm text-[#233343] shrink-0">
              รหัสผ่าน :
            </label>
            <div className="flex-1 relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className={cn('h-9 rounded-md pr-10', errors.password && 'border-red-500')}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {errors.password && <p className="text-red-600 text-sm md:ml-[206px]">{errors.password}</p>}

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <label htmlFor="confirm_password" className="md:w-[190px] md:text-right text-sm text-[#233343] shrink-0">
              ยืนยันรหัสผ่าน :
            </label>
            <div className="flex-1 relative">
              <Input
                id="confirm_password"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm_password}
                onChange={(e) => update('confirm_password', e.target.value)}
                className={cn('h-9 rounded-md pr-10', errors.confirm_password && 'border-red-500')}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {errors.confirm_password && <p className="text-red-600 text-sm md:ml-[206px]">{errors.confirm_password}</p>}

          {submitError && (
            <p className="text-red-600 text-sm text-center">{submitError}</p>
          )}

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              className="w-[220px] h-11 bg-[#74c4df] hover:bg-[#74c4df]/90 text-white"
              disabled={submitting}
            >
              {submitting ? 'กำลังบันทึก...' : 'ยืนยันสมัครสมาชิก'}
            </Button>
          </div>
        </form>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          มีบัญชีอยู่แล้ว? <Link to="/login" className="text-primary hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </section>
    </div>
  )
}
