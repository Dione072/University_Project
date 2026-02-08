import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const ASSESSMENT_HISTORY_TABLE = 'assessment_history'

/** แปลง test_type จาก DB เป็นชื่อแสดงผลภาษาไทย */
const TEST_TYPE_LABEL = {
  'DASS-21': 'แบบทดสอบสุขภาพหัวใจ',
  'EQ Test': 'แบบทดสอบความฉลาดทางอารมณ์',
}

function formatDateTime(isoString) {
  if (!isoString) return '-'
  const d = new Date(isoString)
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistoryPage() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase || !user?.username) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function fetchHistory() {
      setError(null)
      const { data, error: err } = await supabase
        .from(ASSESSMENT_HISTORY_TABLE)
        .select('id, test_type, completed_at, raw_answers')
        .eq('student_id', user.username)
        .order('completed_at', { ascending: false })

      if (cancelled) return
      if (err) {
        setError(err.message)
        setList([])
      } else {
        setList(data ?? [])
      }
      setLoading(false)
    }
    fetchHistory()
    return () => { cancelled = true }
  }, [user?.username])

  return (
    <div className="pt-20 px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#3a4a63] mb-6">ประวัติการทำแบบทดสอบ</h1>

      {loading && (
        <p className="text-muted-foreground">กำลังโหลด...</p>
      )}

      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      {!loading && !error && list.length === 0 && (
        <p className="text-muted-foreground">ยังไม่มีประวัติการทำแบบทดสอบ</p>
      )}

      {!loading && list.length > 0 && (
        <ul className="space-y-4">
          {list.map((row) => (
            <li key={row.id}>
              <Card className="rounded-xl border-[#c4cbd4]/50 bg-white/90">
                <CardHeader className="pb-2">
                  <h2 className="text-lg font-medium text-[#3a4a63]">
                    {TEST_TYPE_LABEL[row.test_type] ?? row.test_type}
                  </h2>
                </CardHeader>
                <CardContent className="pt-0 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    วันที่ทำ: {formatDateTime(row.completed_at)}
                  </p>
                  {Array.isArray(row.raw_answers) && (
                    <p className="text-xs text-muted-foreground">
                      ตอบครบ {row.raw_answers.length} ข้อ
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
