# Student Graduation System

A Vue 3 + Vite application for managing an RFID-based graduation display system. Admins can manage students and their RFID cards, monitor scans in real-time, and project a public display with Text‑to‑Speech announcements.

**Tech Stack**
- Vue 3, Vite, Pinia, Vue Router, Tailwind CSS
- Supabase (Auth, Postgres, Storage, Realtime)

**Key Features**
- Admin authentication (register, login, reset password)
- Students management (CRUD) with photo upload to Supabase Storage
- Real-time scan monitoring and latest announcement card
- Public display page with Text‑to‑Speech
- Scan history with recent scans

---

## Getting Started

- Prerequisites: Node.js 20+ (`package.json:engines`)
- Install dependencies:
```
npm install
```
- Development server:
```
npm run dev
```
- Production build:
```
npm run build
```
- Preview build:
```
npm run preview
```

Import Tailwind in your app’s entry CSS if needed (example in `src/index.css:1`).

---

## Environment Variables

Create `.env` in project root with:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```
Restart the dev server after changes.

Connection status logs appear in the browser console during runtime. See `src/lib/supabase.js:12`.

---
## Project Structure (key files)
- `src/lib/supabase.js` — Supabase client and connection logging
- `src/stores/auth.js` — Auth flows and session handling
- `src/stores/students.js` — Students CRUD and photo upload
- `src/components/StudentModal.vue` — Add/Edit student with photo upload
- `src/views/DashboardView.vue` — Latest scan, recent history, realtime subscription

Code references:
- Upload Photo flow: `src/stores/students.js:105`
- Delete Student: `src/stores/students.js:88`
- Supabase client creation and logs: `src/lib/supabase.js:12`

---

## Routes
- `/login` — Admin login
- `/dashboard` — Real-time monitoring and latest scan
- `/students` — Manage students and RFID cards
- `/display` — Public display with TTS

---

## Troubleshooting
- Upload fails
  - Ensure `.env` is set and the bucket `student-photos` exists
  - Check file type (JPG/PNG) and size (< 2MB)
  - Console shows details: `Failed to upload photo: { message, status }` from `src/stores/students.js:127`

- Connection shows Offline
  - Verify `.env` values and restart dev server
  - Confirm tables exist (queries use `'students'` and `'scan_logs'`)

---

## Recommended Tools
- VS Code + Vue (Official) extension
- Vue.js devtools for your browser
