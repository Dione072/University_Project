# CheckJai

แอปดูแลสุขภาพใจ – หน้าแรก จดหมายถึงหัวใจ แบบทดสอบสุขภาพหัวใจและความฉลาดทางอารมณ์

## Tech Stack

- **Framework:** React 18 (Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + สไตล์ ShadcnUI (Button, Input, Card, Dialog)
- **State:** React Context (Auth) + LocalStorage (คำตอบแบบทดสอบ, สถานะล็อกอิน)

## โครงสร้างโปรเจกต์ (ตามแบบสากล)

```
checkjai01/
├── public/
│   ├── favicon.svg
│   └── images/          # รูป Hero, การ์ด, แบบทดสอบ, พื้นหลัง
├── src/
│   ├── components/      # Layout, AppHeader, LetterDialog, ui/*
│   ├── context/         # AuthContext (login/logout + LocalStorage)
│   ├── data/            # ข้อความจดหมาย, คำถามแบบทดสอบ
│   ├── lib/             # utils (cn)
│   ├── pages/           # Home, Login, Register, Quiz, Profile, History
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── jsconfig.json        # alias @ -> src
```

## การรัน

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

## สร้าง Build

```bash
npm run build
npm run preview   # ดูผลลัพธ์ build
```

## หน้าที่มี

- `/` – หน้าแรก (Hero, จดหมายถึงหัวใจ, แบบทดสอบ)
- `/login` – เข้าสู่ระบบ (state เก็บใน Context + LocalStorage)
- `/register` – สมัครสมาชิก (validation รหัสผ่าน 8–12 ตัว, ใหญ่/เล็ก/ตัวเลข)
- `/quiz/heart` – แบบทดสอบสุขภาพหัวใจ (คำตอบเก็บใน LocalStorage)
- `/quiz/emotion` – แบบทดสอบความฉลาดทางอารมณ์
- `/profile` – ข้อมูลส่วนตัว (placeholder)
- `/history` – ประวัติการทำแบบทดสอบ (placeholder)

## หน้า Register กับ Supabase

ฟอร์มสมัครสมาชิกโยงกับ Table ตามนี้:

| ฟิลด์ในฟอร์ม | คอลัมน์ใน Table |
|--------------|------------------|
| ชื่อ - นามสกุล (ภาษาไทย) | `full_name_th` |
| รหัสประจำตัวนักศึกษา | `student_id` |
| คณะ | `faculty` |
| สาขา / วิชา | `major` |
| ชั้นปีที่ศึกษา | `year_level` |
| รหัสผ่าน | `password` |

ชื่อ Table ใช้ `students` (แก้ได้ที่ `src/pages/RegisterPage.jsx` ตัวแปร `TABLE_NAME`)

สร้าง Table ใน Supabase (Table Editor → New table) หรือรัน SQL:

```sql
create table students (
  id uuid default gen_random_uuid() primary key,
  full_name_th text,
  student_id text,
  faculty text,
  major text,
  year_level text,
  password text,
  created_at timestamptz default now()
);
```

## ประวัติแบบทดสอบ (assessment_history)

เมื่อผู้ใช้กด **ส่งคำตอบ** ครบทุกข้อ ระบบจะบันทึกลงตาราง `assessment_history` ดังนี้:

| ความหมาย | คอลัมน์ใน Table |
|----------|------------------|
| ประเภทแบบทดสอบ | `test_type` (ค่า: `DASS-21` = แบบทดสอบสุขภาพหัวใจ, `EQ Test` = แบบทดสอบความฉลาดทางอารมณ์) |
| รหัสนักศึกษา | `student_id` |
| รหัสการทำแบบทดสอบแต่ละครั้ง | `id` (uuid สร้างอัตโนมัติ) |
| วันที่และเวลาที่ทำ | `completed_at` |
| คำตอบแต่ละข้อ (JSON) | `raw_answers` (array เช่น `[0, 2, 1, 3, ...]` = ตัวเลือกที่เลือกในข้อ 1, 2, 3, ...) |

สร้างตารางใน Supabase (SQL Editor) โดยให้ `student_id` อ้างอิงจากตาราง `students`:

```sql
create table assessment_history (
  id uuid default gen_random_uuid() primary key,
  test_type text not null,
  student_id text not null references students(student_id),
  completed_at timestamptz not null,
  raw_answers jsonb not null
);
```
