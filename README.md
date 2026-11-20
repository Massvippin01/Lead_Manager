# Meru Lead Manager

> **Full Stack Developer Screening Assignment** for **Meru Technosoft Pvt. Ltd.**  
> A high-performance, full-stack sales lead tracking platform built with **Next.js (App Router)**, **Node.js (Express + TypeScript)**, **Prisma ORM**, **Neon PostgreSQL**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌐 Live Production Deployments & Access

| Resource | URL / Access |
| :--- | :--- |
| **Live Backend API** | [https://meru-lead-api.onrender.com](https://meru-lead-api.onrender.com) |
| **API Health Check** | [https://meru-lead-api.onrender.com/api/v1/health](https://meru-lead-api.onrender.com/api/v1/health) |
| **Evaluation Account** | `demo@meru.com` |
| **Evaluation Password** | `password123` |
| **GitHub Repository** | [https://github.com/Massvippin01/Lead_Manager](https://github.com/Massvippin01/Lead_Manager) |

---

## 🌟 Executive Summary & Features

Meru Lead Manager is an enterprise-grade, high-density sales CRM workspace engineered for modern account executives and sales development reps. It follows a clean, intentional **Linear / Attio-style** design philosophy: pure monochrome carbon/zinc styling, zero distracting rainbow gradients, dense data presentation, and rapid keyboard-first workflows.

### ✅ Core Requirements (100% Completed)
1. **Add a Lead**: Comprehensive prospect capture with verified inputs:
   - Full Name, Email, Phone Number, Company Name, Acquisition Source (Dropdown: Website, Referral, Cold Outreach, LinkedIn, Advertisement, Event, Other), and Pipeline Status (Dropdown: New, Contacted, Qualified, Lost).
2. **List All Leads**: Responsive data table with color-coded status badges, formatted timestamps, direct communication links (`mailto:`, `tel:`), and inline status quick-switching.
3. **Edit a Lead**: Modal interface to update contact details, company information, acquisition source, deal value, priority, and status.
4. **Delete a Lead (Confirmation Step)**: Safe deletion workflow requiring explicit user confirmation in a dedicated modal to prevent accidental data loss.
5. **Search & Filter Leads**:
   - Real-time debounced search by name, email, or company.
   - Filter dropdowns by pipeline **Status**, **Priority** (P1, P2, P3), and acquisition **Source**.
   - One-click reset button to clear all active filters and return to default view.
6. **Robust Input Validation**: Dual-layer validation on both frontend (live feedback, regex matching for email and phone numbers) and backend (Zod schema validation middleware returning structured 400 Bad Request error arrays).

### 🚀 Production CRM Elevators (100% Completed)
- **High-Density Linear / Attio Aesthetic**: Completely purged of "vibe-coded" gradient washes or unstyled defaults. Features solid carbon zinc tones (`#09090b`), muted semantic status dots, and crisp tabular numbers.
- **100% Radix UI Select & Dropdown Architecture**: Zero unstyled browser-native `<select>` tags anywhere in the application. Replaced with accessible, keyboard-driven Radix floating popovers with color status dots, checkmark indicators, and smooth animations.
- **SaaS Pipeline & Workspace Switcher**: Quick-switcher dropdown in the top navbar allowing seamless transitions between Enterprise SaaS Pipeline, Product-Led Inbound, and Strategic Partnerships, with instant dataset filtering.
- **Modern SaaS Landing Page & 1-Click Demo**: High-converting unauthenticated gateway featuring a hero announcement pill, interactive live product mockup (with Table & Kanban toggling), capabilities bento grid, and a **1-Click Instant Demo Access** button for instant recruiter evaluation.
- **Precision Toast Notifications**: Linear-grade floating alert system anchored strictly to the bottom-right corner with spring animations, clear status icon badges, and tactile dismiss buttons.
- **Spotlight Command Palette (`⌘K` / `Ctrl+K`)**: Raycast-style spotlight overlay with fuzzy search across prospects and quick actions (toggle views, batch import, export CSV, presets, shortcuts) with arrow navigation.
- **Superhuman-Style Table Keyboard Navigation**:
  - `J` / `K` (or `↓` / `↑`): Instant row hopping with active keyboard ring focus.
  - `Enter`: Instantly opens slide-over inspector for the highlighted prospect.
  - `X`: Toggles selection checkbox for bulk operations.
  - `E`: Opens edit modal.
  - `Delete`: Triggers safe delete confirmation.
- **Deal Health & Win Probability Scoring (0-100)**: Real-time calculated score based on pipeline stage, priority tier, deal value, and interaction history. Highlighted with semantic health badges.
- **Visual Pipeline Stage Stepper**: Connected progress track in the slide-over inspector allowing 1-click stage transitions with smooth visual completion feedback.
- **Tactile Outreach Quick Bar**: 1-click contact actions: `Email` (`mailto:`), `Call` (`tel:`), and `Copy Lead Card` (structured clipboard snippet).
- **Interactive Funnel Visualizer**: Real-time breakdown of conversion progression from New Inquiries ➔ In Dialogue ➔ Qualified Deals ➔ Closed, with stage valuation totals.
- **Table Density Switcher**: Toggle between **Comfortable Density** (spacious row layout for tablet/desktop) and **Compact Density** (tight 36px spreadsheet layout for rapid triage).
- **Preset Filter Views**: 1-click curated views matching high-performance sales routines:
  - `All`: Full pipeline overview
  - `P1 Urgent`: High-urgency leads requiring immediate attention
  - `Value >$25k`: Enterprise-tier deals
  - `Needs First Touch`: Fresh inbound leads not yet contacted
  - `Deal Closing`: Qualified opportunities near conversion
- **Interactive Kanban Pipeline Board**: Seamless toggle (`V` shortcut) between **Table View** and a 4-column **Kanban Board** (`New Inquiries`, `In Dialogue`, `Qualified Deals`, `Closed/Lost`) with stage advancement buttons and column valuation sums.
- **Deal Valuation & Revenue Projection**: Track estimated deal values ($ USD) per lead with automatic pipeline revenue and qualified revenue aggregation.
- **Two-Way CSV Data Operations**:
  - **Batch CSV Import**: Modal parser supporting copy-pasted or uploaded CSV records with schema preview and batch ingestion.
  - **Instant CSV Export**: Generates and downloads clean, RFC-compliant CSVs of active filtered leads.
- **Activity Timeline & Call Logging**: Slide-over inspector drawer to log internal notes or phone call summaries with timestamps and historical audit trail.
- **Bulk Lead Operations**: Multi-row selection with a floating action dock to batch-update stages (e.g. mark multiple leads as Contacted or Qualified) or perform bulk deletions.
- **Power Keyboard Shortcuts**:
  - `⌘K` or `Ctrl+K`: Opens Spotlight Command Palette.
  - `/`: Quick focus command search.
  - `N`: Instantly opens New Lead modal.
  - `V`: Toggles between Table View and Kanban Board.
  - `J` / `K`: Navigate rows up / down.
  - `X`: Toggle row selection.
  - `E`: Edit highlighted lead.
  - `?`: Opens Keyboard Shortcuts cheat sheet.
  - `Esc`: Dismisses active dialogs or drawer.
- **Authentication & User Data Isolation**: Stateless JWT authentication with bcrypt password hashing (`/register`, `/login`, `/me`). Every user sees, modifies, and deletes **only their own leads**.
- **Pagination & Multi-Column Sorting**:
  - Server-side pagination with configurable page limits (10, 20, 50 per page), previous/next navigation, and total item indicators.
  - Multi-column sorting by creation date, lead name, company, deal value, priority, or status in ascending/descending order.
- **Pipeline KPI Dashboard**: Real-time summary metric cards calculating total leads, count per status (*New*, *Contacted*, *Qualified*, *Lost*), and conversion win rate.
- **Automated Integration Testing**: 11 automated API integration tests powered by **Vitest** and **Supertest** covering health checks, auth validation, login/register, lead CRUD operations, pagination, unauthorized rejection, bulk actions, notes, and status metrics.

---

## 🛠️ Architecture & Tech Stack

```
meru/
├── client/                     # Next.js 14 (App Router) + TypeScript
│   ├── src/
│   │   ├── app/                # Pages (Dashboard, Login, Register)
│   │   ├── components/
│   │   │   ├── ui/             # Radix primitives (Button, Input, Dialog, Badge, Card)
│   │   │   ├── dashboard/      # LeadsTable, KanbanBoard, LeadDrawer, FilterBar, CsvImportModal, Shortcuts
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
│   │   ├── schema.prisma       # Relational schema, enums & indexes
│   │   └── seed.ts             # Database seeder (Demo user + 10 realistic leads with notes)
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

enum LeadPriority {
  LOW
  MEDIUM
  HIGH
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
  id        String       @id @default(uuid())
  name      String
  email     String
  phone     String
  company   String
  value     Float        @default(0)
  priority  LeadPriority @default(MEDIUM)
  source    LeadSource   @default(WEBSITE)
  status    LeadStatus   @default(NEW)
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  notes     Note[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  @@index([userId])
  @@index([status])
  @@index([priority])
  @@index([source])
  @@index([createdAt])
  @@index([name])
  @@map("leads")
}

model Note {
  id        String   @id @default(uuid())
  content   String
  type      String   @default("NOTE") // NOTE, CALL, STAGE_CHANGE
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([leadId])
  @@map("notes")
}
```

### Indexing & Optimization
- **`@@index([userId])`**: Ensures sub-millisecond lookups when querying a user's scoped leads.
- **`@@index([status])`, `@@index([priority])`, `@@index([source])`**: Accelerates pipeline filtering, presets, and status count aggregation.
- **`@@index([createdAt])` & `@@index([name])`**: Powers multi-column server-side sorting and indexing.
- **Cascade Deletion**: If a user account is deleted, their associated leads and timeline notes are cleanly removed automatically.

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
| `GET` | `/leads` | `search`, `status`, `priority`, `source`, `preset`, `sortBy`, `sortOrder`, `page`, `limit` | Paginated, filtered, and sorted leads list |
| `GET` | `/leads/stats` | — | Aggregated counts by status & pipeline valuation |
| `GET` | `/leads/:id` | — | Fetch single lead details with notes timeline |
| `POST` | `/leads` | — | Create new lead with full validation |
| `PUT` | `/leads/:id` | — | Update existing lead, priority, or status |
| `DELETE` | `/leads/:id` | — | Delete lead permanently |
| `POST` | `/leads/import` | — | Batch import leads array |
| `PATCH` | `/leads/bulk-status`| — | Bulk status update for selected lead IDs |
| `POST` | `/leads/bulk-delete`| — | Bulk deletion of selected lead IDs |
| `POST` | `/leads/:id/notes` | — | Add note or call log to lead timeline |

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** (v18+ or v20+ recommended)
- **npm** (v9+)

### 2. Clone Repository
```bash
git clone https://github.com/Massvippin01/Lead_Manager.git
cd Lead_Manager
```

### 3. Install Dependencies
From the repository root:
```bash
npm run install:all
```

### 4. Setup Environment Variables
Default files are pre-configured with zero setup needed:
```bash
# Server environment (.env is preconfigured for zero-friction SQLite testing)
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env.local
```

### 5. Run Database Migrations & Seed Sample Data
```bash
cd server
npx prisma db push
npx ts-node prisma/seed.ts
cd ..
```
*This populates the database with a pre-configured demo account and 10 realistic leads across all pipeline stages, priorities, deal values, and notes!*

**Demo Account Credentials**:
- **Email**: `demo@meru.com`
- **Password**: `password123`

### 6. Run Full-Stack Application
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
npx vitest run
```

### Test Coverage Summary (11/11 Passing):
- ✅ `GET /api/v1/health`: API service health check
- ✅ `POST /api/v1/auth/register`: Input validation & successful user registration
- ✅ `POST /api/v1/auth/login`: Credential validation & password mismatch handling
- ✅ `GET /api/v1/leads`: Unauthorized access denial (401)
- ✅ `GET /api/v1/leads`: Paginated lead retrieval for authenticated user
- ✅ `POST /api/v1/leads`: Lead creation with full field verification
- ✅ `POST /api/v1/leads`: Rejection of invalid emails and malformed phone numbers
- ✅ `PATCH /api/v1/leads/bulk-status`: Batch stage transitions and event logging
- ✅ `POST /api/v1/leads/bulk-delete`: Bulk lead deletion
- ✅ `POST /api/v1/leads/:id/notes`: Note and call interaction creation & timeline retrieval
- ✅ `GET /api/v1/leads/stats`: Dynamic KPI counts and pipeline valuation calculation

---

## 💡 Assumptions Made

1. **User Scoping & Data Isolation**: We assumed each sales representative requires their own private lead pipeline. Therefore, all lead CRUD operations, presets, and dashboard statistics are strictly scoped to the authenticated `userId`.
2. **Standard Acquisition Sources**: Sales leads typically originate from known channels, so we modeled `LeadSource` as a structured enum (`WEBSITE`, `REFERRAL`, `COLD_OUTREACH`, `LINKEDIN`, `ADVERTISEMENT`, `EVENT`, `OTHER`) with a fallback for general entries.
3. **Optimized Quick Updates**: Sales workflows require rapid stage updates; in addition to full lead editing via modal, users can directly update status via the dropdown badge in each table row or drag-free stage movement in Kanban view.

---

## 🔮 What We Would Improve With More Time

1. **Real-time WebSockets Collaboration**: Multi-user live updates using Socket.io or Pusher so teams can see new leads appear without manual sync.
2. **AI Email Assist**: Integration with Gemini/OpenAI API to draft personalized outreach emails directly from the prospect's company and timeline notes.
3. **Custom Fields & Webhook Ingestion**: Allow sales ops to define custom lead metadata fields and expose incoming webhooks for Zapier/HubSpot intake.

---

## 💬 Developer Note (Pride & Challenges)

> **What I am particularly proud of:**  
> Elevating what could have been a basic CRUD form into a high-density, professional CRM workspace. Eliminating generic gradient aesthetics in favor of a crisp, monochrome Linear-style interface makes the app feel like a real product sales reps would enjoy using every day. The dual Table/Kanban modes, density switch, batch CSV sync, and keyboard shortcuts give it exceptional speed and polish.
>  
> **What was tricky:**  
> Seamlessly syncing state between client-side optimistic UI updates, debounced multi-criteria filter presets, and server-side pagination while preserving timeline note audit history during bulk transitions.

---

## 👨‍💻 Author & Submission Details
- **Candidate**: Vippin Antony P
- **Email**: massvippin@gmail.com
- **Repository**: [https://github.com/Massvippin01/Lead_Manager](https://github.com/Massvippin01/Lead_Manager)
