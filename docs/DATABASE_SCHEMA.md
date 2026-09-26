# PlaceAI Database Schema & Supabase Configuration

This document specifies the PostgreSQL relational schema used in PlaceAI's Supabase backend.

---

## 🗄️ Tables Specification

### 1. `user_profiles`
Stores profile data, college details, and placement progress for registered candidates.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Unique record identifier |
| `user_id` | `uuid` (FK) | Auth UID mapped to `auth.users.id` |
| `name` | `text` | Candidate full name |
| `email` | `text` | Registered email address |
| `phone` | `text` | Contact phone number |
| `college` | `text` | Institute / College name |
| `branch` | `text` | Academic stream (MCA, CSE, etc.) |
| `graduation_year`| `integer` | Expected or completion year |
| `cgpa` | `numeric(4,2)` | Cumulative grade point average |
| `readiness_score`| `integer` | AI placement readiness rating (0-100) |
| `resume_url` | `text` | Storage bucket path to latest resume |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Record last updated timestamp |

---

### 2. `practice_submissions`
Tracks DSA challenge attempts, execution outcomes, and pass/fail metrics.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Unique submission ID |
| `user_id` | `uuid` (FK) | Candidate ID |
| `problem_id` | `text` | Canonical problem key |
| `language` | `text` | Programming language (`javascript`, `python`, `cpp`, `java`) |
| `code` | `text` | Submitted solution source code |
| `status` | `text` | `ACCEPTED`, `WRONG_ANSWER`, `TLE`, `COMPILATION_ERROR` |
| `runtime_ms` | `integer` | Execution time in milliseconds |
| `submitted_at` | `timestamptz` | Submission timestamp |

---

### 3. `mock_interviews`
Records AI mock interview sessions, questions asked, candidate answers, and scoring.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Session ID |
| `user_id` | `uuid` (FK) | Candidate ID |
| `domain` | `text` | Topic (Frontend, Backend, DSA, HR) |
| `overall_score`| `numeric(4,1)` | Overall rating (out of 10.0) |
| `feedback` | `jsonb` | Granular breakdown of strengths & improvements |
| `completed_at` | `timestamptz` | Session conclusion timestamp |
