# cityzen-server

Express.js backend API server สำหรับ **cityzen-homepage** — ทำหน้าที่แทน Supabase Edge Functions และรองรับ use case แบบ self-hosted

## Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Runtime    | **Bun** (TypeScript native — ไม่ต้อง compile) |
| Framework  | Express 4                                    |
| Database   | Supabase (PostgreSQL + RLS)                  |
| File Upload| Multer 2 (memory storage → Supabase Storage) |
| Auth       | Supabase JWT (forwarded from frontend)        |

---

## API Endpoints

| Method | Path                              | Auth          | Description                          |
| ------ | --------------------------------- | ------------- | ------------------------------------ |
| GET    | `/api/health`                     | —             | Health check                         |
| GET    | `/api/mapbox-token`               | —             | Mapbox token (safe, server-side only)|
| GET    | `/api/projects`                   | —             | รายการโครงการที่เปิดรับ                |
| GET    | `/api/projects/:id`               | —             | ข้อมูลโครงการเดี่ยว                   |
| POST   | `/api/projects/:id/reserve`       | Bearer JWT    | จองสิทธิ์โครงการ (atomic + anti-race)|
| GET    | `/api/reservations`               | Bearer JWT    | สิทธิ์ที่รับไว้ทั้งหมดของผู้ใช้        |
| POST   | `/api/verify-qr`                  | x-staff-secret| เจ้าหน้าที่ตรวจสอบ QR Code            |
| POST   | `/api/reports`                    | —             | แจ้งปัญหา (multipart + images)       |
| GET    | `/api/profile`                    | Bearer JWT    | ดูโปรไฟล์ตัวเอง                      |
| PATCH  | `/api/profile`                    | Bearer JWT    | แก้ไขโปรไฟล์                         |
| GET    | `/api/locations/provinces`        | —             | รายชื่อจังหวัดทั้งหมด                 |
| GET    | `/api/locations/districts`        | —             | อำเภอตาม `?province_id=<uuid>`       |
| GET    | `/api/locations/subdistricts`     | —             | ตำบลตาม `?district_id=<uuid>`        |

---

## Getting Started

### 1. ตั้งค่า Environment

```bash
cp .env.example .env
```

เปิดไฟล์ `.env` แล้วเติม `SUPABASE_SERVICE_ROLE_KEY` จาก Supabase Dashboard:
> Settings → API → **service_role** (เก็บเป็นความลับ อย่า commit ขึ้น git)

### 2. Install Dependencies

```bash
bun install
```

### 3. Start Server

```bash
# Development (hot reload อัตโนมัติเมื่อไฟล์เปลี่ยน)
bun dev

# Production
bun start
```

Server จะรันที่ **http://localhost:3001**

---

## Project Structure

```
cityzen-server/
├── src/
│   ├── index.ts              # Entry point — Express app + all routes
│   ├── types/
│   │   └── index.ts          # Shared TypeScript types
│   ├── lib/
│   │   └── supabase.ts       # Supabase client factory (admin + per-user)
│   ├── middleware/
│   │   └── auth.ts           # JWT validation & staff secret middleware
│   └── routes/
│       ├── projects.ts       # /api/projects
│       ├── reservations.ts   # /api/reservations
│       ├── verifyQr.ts       # /api/verify-qr
│       ├── reports.ts        # /api/reports
│       ├── locations.ts      # /api/locations/*
│       ├── mapbox.ts         # /api/mapbox-token
│       └── profile.ts        # /api/profile
├── .env                      # ⚠️ ห้าม commit
├── .env.example              # Template
├── .gitignore
├── tsconfig.json
└── package.json
```

---

## Connecting to the Frontend

เพิ่มใน `cityzen-homepage/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

แล้วแทนที่ Supabase Edge Function calls ด้วย `${VITE_API_BASE_URL}/api/...`

ตัวอย่าง — `MyPage.tsx` (GET reservations):

```ts
// เดิม (Edge Function)
const res = await fetch(`${supabaseUrl}/functions/v1/get-my-reservations`, { ... });

// ใหม่ (cityzen-server)
const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reservations`, {
  headers: { Authorization: `Bearer ${session.access_token}` },
});
```

---

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` — ใช้เฉพาะ server-side เท่านั้น bypasses RLS ทั้งหมด
- `STAFF_SECRET` — ส่งผ่า header `x-staff-secret` ใน `/api/verify-qr` เท่านั้น
- ไฟล์ `.env` อยู่ใน `.gitignore` แล้ว
# citizen-server
