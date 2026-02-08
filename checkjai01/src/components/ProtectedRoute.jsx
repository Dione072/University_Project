import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * แสดง children เฉพาะเมื่อมี user (ล็อกอินแล้ว)
 * ถ้ายังไม่ล็อกอิน จะ redirect ไปหน้า /login
 */
export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
