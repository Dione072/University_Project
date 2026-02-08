import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LetterDialog } from '@/components/LetterDialog'
import { cardMessages } from '@/data/letterMessages'

const cards = [
  { img: '/images/Card1.png', emoji: '🌤️' },
  { img: '/images/Card2.png', emoji: '💗' },
  { img: '/images/Card3.png', emoji: '🌱' },
  { img: '/images/Card4.png', emoji: '🤍' },
]

export function HomePage() {
  const [letterOpen, setLetterOpen] = useState(false)
  const [letterContent, setLetterContent] = useState({ title: '', message: '' })

  const openLetter = (index) => {
    const msg = cardMessages[index] ?? cardMessages[0]
    setLetterContent({ title: msg.title, message: msg.message })
    setLetterOpen(true)
  }

  return (
    <div className="pt-0">
      <section className="w-full bg-[#b9d3f0]">
        <img
          src="/images/Home1.png"
          alt="Hero"
          className="w-full h-auto object-cover max-h-[420px] md:max-h-none"
        />
      </section>

      <div className="bg-[#f4f7fb] py-10 px-4">
        <div className="flex items-center justify-center gap-5 text-[#3a4a63] text-xl my-5">
          <span className="w-[150px] h-px bg-[#c4cbd4]" />
          จดหมายถึงหัวใจ
          <span className="w-[150px] h-px bg-[#c4cbd4]" />
        </div>
      </div>

      <div className="bg-[#f4f7fb] pt-6 pb-14 px-4">
        <div className="flex flex-wrap justify-center gap-8 max-w-[1200px] mx-auto">
          {cards.map((card, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openLetter(i)}
              className="text-center cursor-pointer p-2 pb-4 rounded-2xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:bg-[#e4effa]"
            >
              <div className="w-[260px] h-[340px] rounded-[14px] bg-[#d7e6f5] overflow-hidden flex items-center justify-center mb-2">
                <img
                  src={card.img}
                  alt={`การ์ด ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-[#555]">{card.emoji}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#f4f7fb] pb-5">
        <div className="flex items-center justify-center gap-5 text-[#3a4a63] text-xl my-5 mb-10">
          <span className="w-[150px] h-px bg-[#c4cbd4]" />
          แบบทดสอบ
          <span className="w-[150px] h-px bg-[#c4cbd4]" />
        </div>
      </div>

      <Link
        to="/quiz/heart"
        className="flex justify-center items-center gap-12 py-16 px-4 bg-[#f4f7fb] hover:shadow-lg transition-all cursor-pointer"
      >
        <div className="flex items-center gap-12 max-w-[1000px] py-10 px-12 bg-[#b1cbe0] rounded-2xl">
          <div className="w-[260px] h-[260px] rounded-[14px] bg-[#d7e6f5] overflow-hidden flex-shrink-0">
            <img src="/images/Home3.png" alt="แบบทดสอบสุขภาพหัวใจ" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-[360px] text-white">
            <h3 className="text-xl mb-3">แบบทดสอบสุขภาพของหัวใจ</h3>
            <p className="text-base leading-relaxed mb-4">
              ในบางช่วงเวลาที่หัวใจเราหนักอึ้งไปด้วยความกังวล การหยุดดูแลตัวเองภายในใจเป็นเรื่องสำคัญไม่น้อยไปกว่าสิ่งรอบตัว
              ลองทำแบบทดสอบนี้เพื่อสำรวจระดับความเหนื่อยล้าของหัวใจ และเรียนรู้วิธีอ่อนโยนกับตัวเองให้มากขึ้น
            </p>
            <span className="inline-block py-2 px-4 bg-white/30 rounded-full text-white text-sm">
              คลิกเพื่อเริ่มทำแบบทดสอบ
            </span>
          </div>
        </div>
      </Link>

      <Link
        to="/quiz/emotion"
        className="flex justify-center items-center gap-12 py-16 px-4 bg-[#f4f7fb] hover:shadow-lg transition-all cursor-pointer"
      >
        <div className="flex items-center gap-12 max-w-[1000px] py-10 px-12 bg-[#b1cbe0] rounded-2xl">
          <div className="max-w-[360px] text-white order-2 md:order-1">
            <h3 className="text-xl mb-3">แบบทดสอบความฉลาดทางอารมณ์</h3>
            <p className="text-base leading-relaxed mb-4">
              ในแต่ละวันเราต้องพบเจอผู้คนและสถานการณ์ที่หลากหลาย การเข้าใจอารมณ์ของตัวเองคือกุญแจสำคัญในการดูแลใจ
              แบบทดสอบนี้จะช่วยให้เรามองเห็นมุมมองภายในใจชัดเจนขึ้น และค่อย ๆ เรียนรู้ที่จะอยู่กับตัวเองอย่างอ่อนโยน
            </p>
            <span className="inline-block py-2 px-4 bg-white/30 rounded-full text-white text-sm">
              คลิกเพื่อเริ่มทำแบบทดสอบ
            </span>
          </div>
          <div className="w-[260px] h-[260px] rounded-[14px] bg-[#d7e6f5] overflow-hidden flex-shrink-0 order-1 md:order-2">
            <img src="/images/Home2.png" alt="แบบทดสอบอารมณ์" className="w-full h-full object-cover" />
          </div>
        </div>
      </Link>

      <LetterDialog
        open={letterOpen}
        onOpenChange={setLetterOpen}
        title={letterContent.title}
        message={letterContent.message}
      />
    </div>
  )
}
