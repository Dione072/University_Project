import { useAuth } from '@/context/AuthContext'

export function ProfilePage() {
  const { user } = useAuth()
  return (
    <div className="pt-20 px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#3a4a63] mb-4">ข้อมูลส่วนตัว</h1>
      {user ? (
        <p className="text-muted-foreground">สวัสดีค่ะ {user.name || user.username}</p>
      ) : (
        <p className="text-muted-foreground">กรุณาเข้าสู่ระบบเพื่อดูข้อมูลส่วนตัว</p>
      )}
    </div>
  )
}
