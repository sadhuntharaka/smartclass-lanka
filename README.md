# SmartClass Lanka (Firebase Edition)
Stack: React + Vite + Tailwind + Firebase (Firestore, Storage)

## Setup
1) `npm install`
2) `npm run dev`

## Build → Netlify
1) `npm run build` → creates `dist/`
2) https://app.netlify.com → Add new site → Deploy manually → Drag & drop **dist/**

## Firebase Collections (MVP)
- teachers: full_name, phone, email, password, subscription_start, subscription_end, student_limit (100), status ('active'|'suspended')
- classes: class_name, subject, schedule_time
- students: full_name, school, grade, parent_name, parent_phone, class_id, qr_code_url
- attendance: student_id, date, time, status
- payments: student_id, month, amount, payment_date, invoice_url
- marks: student_id, test_name, score, max_score, test_date
- access_requests: full_name, whatsapp, email, students, message, status, created_at

## Admin
- /admin-login (dimuthu / 2002)

Generated: 2025-10-24
