# Meru Lead Manager

> **Full Stack Developer Screening Assignment** for **Meru Technosoft Pvt. Ltd.**  
> A high-performance, full-stack sales lead tracking platform built with **Next.js (App Router)**, **Node.js (Express + TypeScript)**, **PostgreSQL (Prisma ORM)**, **Shadcn/ui**, and **Framer Motion**.

---

## 🌟 Executive Summary & Features

Meru Lead Manager is an enterprise-grade sales pipeline management application designed to help sales teams capture, track, qualify, and convert prospective client opportunities efficiently.

### ✅ Core Requirements (100% Completed)
1. **Add a Lead**: Comprehensive prospect capture with verified inputs:
   - Full Name, Email, Phone Number, Company Name, Acquisition Source (Dropdown: Website, Referral, Cold Outreach, LinkedIn, Advertisement, Event, Other), and Pipeline Status (Dropdown: New, Contacted, Qualified, Lost).
2. **List All Leads**: Responsive data table with color-coded status badges, formatted timestamps, direct communication links (`mailto:`, `tel:`), and inline status quick-switching.
3. **Edit a Lead**: Modal interface to update contact details, company information, acquisition source, and status.
4. **Delete a Lead (Confirmation Step)**: Safe deletion workflow requiring explicit user confirmation in a dedicated modal to prevent accidental data loss.
5. **Search & Filter Leads**:
   - Real-time debounced search by name, email, or company.
   - Filter dropdowns by pipeline **Status** and acquisition **Source**.
   - Reset button to clear all active filters in one click.
6. **Robust Validation**: Dual-layer validation on both frontend (live feedback, regex matching for email and phone numbers) and backend (Zod schema validation middleware returning structured 400 Bad Request error arrays).

### 🚀 Bonus Features (100% Completed)
- **Authentication & User Data Isolation**: Stateless JWT authentication with bcrypt password hashing (`/register`, `/login`, `/me`). Every user sees, modifies, and deletes **only their own leads**.
- **Pagination & Multi-Column Sorting**:
  - Server-side pagination with configurable page limits (10, 20, 50 per page), previous/next navigation, and total item indicators.
  - Multi-column sorting by creation date, lead name, company, or status in ascending/descending order.
- **Pipeline KPI Dashboard**: Real-time summary metric cards calculating total leads, count per status (*New*, *Contacted*, *Qualified*, *Lost*), and conversion win rate.
- **Automated Integration Testing**: 11 automated API integration tests powered by **Vitest** and **Supertest** covering health checks, auth validation, login/register, lead CRUD operations, pagination, unauthorized rejection, and status metrics.
- **Containerized Database**: Ready-to-run `docker-compose.yml` providing a zero-friction PostgreSQL 16 instance.

---

## 🛠️ Architecture & Tech Stack

```
meru/
├── client/                     # Next.js 14 (App Router) + TypeScript
│   ├── src/
│   │   ├── app/                # Pages (Dashboard, Login, Register)
│   │   ├── components/
│   │   │   ├── ui/             # Shadcn-style components (Button, Input, Dialog, Badge, Card)
│   │   │   ├── dashboard/      # StatsCards, FilterBar, LeadsTable, LeadModal, DeleteDialog
│   │   │   ├── auth/           # LoginForm, RegisterForm
│   │   │   └── layout/         # Navbar, User Menu
│   │   ├── context/            # AuthContext (JWT session), ToastContext (notifications)
│   │   ├── lib/                # API client with token auto-injection & utilities
│   │   └── types/              # Strongly typed TypeScript interfaces
│   └── tailwind.config.ts      # Custom theme & animation keyframes
├── server/                     # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/             # Typed environment configuration
│   │   ├── controllers/        # AuthController, LeadController
│   │   ├── middleware/         # Auth verification, Zod validation, Global error handler
│   │   ├── routes/             # REST API routers (/auth, /leads, /health)
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # Business logic & Prisma ORM database queries
│   │   └── app.ts              # Express application factory
│   ├── prisma/
│   │   ├── schema.prisma       # PostgreSQL relational schema, enums & indexes
│   │   └── seed.ts             # Database seeder (Demo user + 10 realistic leads)
│   └── tests/                  # Vitest + Supertest automated API tests
├── docker-compose.yml          # One-command PostgreSQL 16 container
└── package.json                # Monorepo runner (concurrent dev/test scripts)
```

### Stack Rationale
| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 + React + TypeScript** | Modern SSR/CSR hybrid capabilities, optimal page bundle sizes, strict type safety matching backend contracts. |
| **Styling & UI** | **Tailwind CSS + Radix UI + Framer Motion** | Accessible Radix UI primitives, clean modern visual hierarchy, fluid micro-interactions, and responsive layout. |
| **Backend API** | **Node.js + Express + TypeScript** | Industry standard, modular MVC architecture (Routes, Controllers, Services), high-throughput I/O. |
| **Database & ORM** | **SQLite (Dev) / PostgreSQL (Prod) + Prisma ORM** | Out-of-the-box zero-setup database for instant local evaluation without requiring external database daemons, with full Prisma relational migration compatibility. |
| **Data Validation** | **Zod** | Composable schema validation guarding both request bodies and query parameters with explicit error arrays. |
| **Testing** | **Vitest + Supertest** | Sub-second test execution, end-to-end HTTP endpoint validation without mocking server instances. |

---

## 🗄️ Database Design & Schema

Defined in `server/prisma/schema.prisma`:

```prisma
enum LeadSource {
  WEBSITE
  REFERRAL
  COLD_OUTREACH
  LINKEDIN
  ADVERTISEMENT
  EVENT
  OTHER
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  LOST
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  leads     Lead[]

  @@index([email])
  @@map("users")
}

model Lead {
  id        String     @id @default(uuid())
  name      String
  email     String
  phone     String
  company   String
  source    LeadSource @default(WEBSITE)
  status    LeadStatus @default(NEW)
  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([userId])
  @@index([status])
  @@index([source])
  @@index([createdAt])
  @@index([name])
  @@map("leads")
}
```

### Indexing & Optimization
- **`@@index([userId])`**: Ensures fast lookups when querying a user's scoped leads.
- **`@@index([status])` & `@@index([source])`**: Accelerates pipeline filtering and status count aggregation.
- **`@@index([createdAt])` & `@@index([name])`**: Powers multi-column server-side sorting and indexing.
- **Cascade Deletion**: If a user account is deleted, their associated leads are cleanly removed automatically.

---

## 🔌 REST API Specification

Base URL: `http://localhost:5000/api/v1`

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new account and return JWT | No |
| `POST` | `/auth/login` | Sign in with email and password | No |
| `GET` | `/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |

### Lead Management Endpoints
| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/leads` | `search`, `status`, `source`, `sortBy`, `sortOrder`, `page`, `limit` | Paginated, filtered, and sorted leads list |
| `GET` | `/leads/stats` | — | Aggregated counts by status & win rate |
| `GET` | `/leads/:id` | — | Fetch single lead details |
| `POST` | `/leads` | — | Create new lead with full validation |
| `PUT` | `/leads/:id` | — | Update existing lead or status |
| `DELETE` | `/leads/:id` | — | Delete lead permanently |

### Sample Success Response (`GET /api/v1/leads/stats`)
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 10,
      "new": 3,
      "contacted": 3,
      "qualified": 3,
      "lost": 1,
      "conversionRate": "30.0%"
    }
  }
}
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** (v18+ or v20+ recommended)
- **npm** (v9+)
- **PostgreSQL** (running locally OR via Docker)

### 2. Clone Repository
```bash
git clone https://github.com/Massvippin01/Lead_Manager.git
cd Lead_Manager
```

### 3. Start PostgreSQL (Option A: Using Docker)
If Docker is installed:
```bash
docker compose up -d
```
*Starts PostgreSQL 16 on port 5432 with database `lead_manager`.*

*(Option B: If you already have a local PostgreSQL instance, ensure your connection string in `server/.env` matches `postgresql://<user>:<password>@localhost:5432/<dbname>`)*

### 4. Install Dependencies
From the repository root:
```bash
# Installs root, server, and client dependencies
npm run install:all
```

### 5. Setup Environment Variables
Copy the provided `.env.example` files:
```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env.local
```

### 6. Run Database Migrations & Seed Sample Data
```bash
cd server
npx prisma db push
npx ts-node prisma/seed.ts
cd ..
```
*This populates the database with a pre-configured demo account and 10 realistic leads across all pipeline stages!*

**Demo Account Credentials**:
- **Email**: `demo@meru.com`
- **Password**: `password123`

### 7. Run Full-Stack Application
From the repository root:
```bash
npm run dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🧪 Automated Testing

Automated integration tests verify all endpoints, error handling, status transitions, and data integrity:

```bash
# Run tests from root
npm run test

# Or directly in the server directory
cd server
npm run test
```

### Test Coverage Summary:
- ✅ `GET /api/v1/health`: API service health check
- ✅ `POST /api/v1/auth/register`: Input validation & successful user registration
- ✅ `POST /api/v1/auth/login`: Credential validation & password mismatch handling
- ✅ `GET /api/v1/leads`: Unauthorized access denial (401)
- ✅ `GET /api/v1/leads`: Paginated lead retrieval for authenticated user
- ✅ `POST /api/v1/leads`: Lead creation with full field verification
- ✅ `POST /api/v1/leads`: Rejection of invalid emails and malformed phone numbers
- ✅ `PUT /api/v1/leads/:id`: Status modification and details updating
- ✅ `DELETE /api/v1/leads/:id`: Lead deletion & confirmation
- ✅ `GET /api/v1/leads/stats`: Dynamic KPI counts and conversion percentage calculation

---

## 💡 Assumptions Made

1. **User Scoping & Data Isolation**: We assumed each sales representative requires their own private lead pipeline. Therefore, all lead CRUD operations and dashboard statistics are strictly scoped to the authenticated `userId`.
2. **Standard Acquisition Sources**: Sales leads typically originate from known channels, so we modeled `LeadSource` as a structured enum (`WEBSITE`, `REFERRAL`, `COLD_OUTREACH`, `LINKEDIN`, `ADVERTISEMENT`, `EVENT`, `OTHER`) with a fallback for general entries.
3. **Optimized Quick Updates**: Sales workflows require rapid stage updates; in addition to full lead editing via modal, users can directly update status via the dropdown badge in each table row.

---

## 🔮 What We Would Improve With More Time

1. **Activity Timeline & Notes**: Add a historical log of interactions (calls, meetings, email logs) per lead.
2. **CSV / Excel Export & Import**: Batch import contacts from spreadsheets and export filtered views for executive reporting.
3. **Kanban Board View**: A drag-and-drop pipeline board (using `@hello-pangea/dnd` or `dnd-kit`) to visually move cards between *New* → *Contacted* → *Qualified* → *Lost*.
4. **Email Automation Webhooks**: Integrate with SendGrid or Resend to send automated follow-up emails upon status changes.

---

## 💬 Developer Note (Pride & Challenges)

> **What I am particularly proud of:**  
> The cohesive, frictionless user experience achieved by combining Shadcn UI design tokens with Framer Motion layout transitions. The dashboard feels snappy, responsive, and tactile, giving sales reps instant feedback with inline status updates and debounced multi-criteria filtering without table flickering.
>  
> **What was tricky:**  
> Balancing comprehensive backend Zod validation with intuitive frontend error mapping while keeping server-side pagination and dynamic sorting completely synchronized during rapid filter resets.

---

## 👨‍💻 Author & Submission Details
- **Candidate**: Vippin Antony P
- **Email**: massvippin@gmail.com
- **Repository**: [https://github.com/Massvippin01/Lead_Manager](https://github.com/Massvippin01/Lead_Manager)
