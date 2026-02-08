import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { heartQuizQuestions } from '@/data/quizQuestions'
import { supabase } from '@/lib/supabase'

const QUIZ_STORAGE_KEY = 'checkjai_quiz_answers'
const ASSESSMENT_HISTORY_TABLE = 'assessment_history'

/** ประเภทแบบทดสอบสำหรับ assessment_history */
const TEST_TYPE_MAP = {
  heart: 'DASS-21',      // แบบทดสอบสุขภาพหัวใจ
  emotion: 'EQ Test',      // แบบทดสอบความฉลาดทางอารมณ์
}

function usePersistedAnswers(quizType) {
  const key = `${QUIZ_STORAGE_KEY}_${quizType}`
  const [answers, setAnswers] = useState(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? JSON.parse(s) : []
    } catch {
      return []
    }
  })
  const setAndSave = useCallback(
    (updater) => {
      setAnswers((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {}
        return next
      })
    },
    [key]
  )
  return [answers, setAndSave]
}

export function QuizPage({ type = 'heart' }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const questions = heartQuizQuestions
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = usePersistedAnswers(type)
  const [selectedOption, setSelectedOption] = useState(answers[0] ?? null)
  const [submitting, setSubmitting] = useState(false)

  const current = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const saveAssessmentHistory = async (rawAnswers) => {
    if (!supabase || !user?.username) return
    const testType = TEST_TYPE_MAP[type] ?? 'DASS-21'
    const row = {
      test_type: testType,
      student_id: user.username,
      completed_at: new Date().toISOString(),
      raw_answers: rawAnswers,
    }
    await supabase.from(ASSESSMENT_HISTORY_TABLE).insert(row)
  }

  const goNext = async () => {
    if (selectedOption === null) return
    const nextAnswers = [...answers]
    nextAnswers[currentIndex] = selectedOption
    setAnswers(nextAnswers)
    if (isLast) {
      setSubmitting(true)
      try {
        await saveAssessmentHistory(nextAnswers)
      } catch {
        // บันทึกไม่สำเร็จยังแสดงข้อความสำเร็จ แล้วค่อยไปหน้าแรก
      } finally {
        setSubmitting(false)
      }
      alert('ตอบครบทุกข้อแล้ว ขอบคุณที่ดูแลหัวใจของตัวเองนะ 💙')
      navigate('/')
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedOption(answers[currentIndex + 1] ?? null)
  }

  const goPrev = () => {
    if (currentIndex === 0) return
    setCurrentIndex((i) => i - 1)
    setSelectedOption(answers[currentIndex - 1] ?? null)
  }

  const selectOption = (index) => {
    setSelectedOption(index)
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed bg-no-repeat pt-16 pb-20"
      style={{ backgroundImage: 'url(/images/bg-beach.png)' }}
    >
      <div className="flex-1 flex justify-center items-center px-4 py-24">
        <div className="max-w-[520px] w-full p-8 md:p-9 text-center rounded-[20px] bg-white/65 shadow-lg">
          <p className="text-sm text-[#5c6b7a] mb-1.5">
            ข้อที่ {currentIndex + 1} จาก {questions.length}
          </p>
          <p className="text-[15px] text-[#3b4652] leading-relaxed mb-6 whitespace-pre-line">
            {current?.text}
          </p>
          <div className="flex flex-col gap-3 mb-4">
            {current?.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectOption(i)}
                className={`
                  min-w-[220px] mx-auto py-2 px-4 rounded-full border text-sm text-[#3b4652]
                  transition-all duration-150
                  ${selectedOption === i ? 'bg-[#d9e6ff] border-[#8aa4ff]' : 'bg-white/90 border-[#cfd6e0] hover:bg-[#f0f5ff]'}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <Button
              variant="outline"
              className="rounded-full bg-white/90 text-[#315c7e] border-[#315c7e]/25"
              disabled={currentIndex === 0}
              onClick={goPrev}
            >
              ย้อนกลับ
            </Button>
            <Button
              className="rounded-full bg-[#315c7e] hover:bg-[#274a63] text-white"
              onClick={goNext}
              disabled={selectedOption === null || submitting}
            >
              {submitting ? 'กำลังบันทึก...' : isLast ? 'ส่งคำตอบ' : 'ถัดไป'}
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed right-4 bottom-4 z-20">
        <button
          type="button"
          className="py-1.5 px-3.5 rounded-full text-xs bg-white/90 text-[#315c7e] shadow-md"
          onClick={() => {}}
        >
          เปิดเสียงคลื่น + เปียโน
        </button>
      </div>
    </div>
  )
}
