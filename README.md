# FlowClaim

A production-grade expense reimbursement platform with a configurable, multi-strategy approval engine, strict role-based access control, and real-time notifications.

Originally built as an 8-hour hackathon prototype, this project has been rebuilt from the ground up: audited for architectural debt, migrated to a managed cloud stack, and hardened with proper authentication, validation, and authorization layers.

---

## Overview

FlowClaim lets employees submit expense claims that route through a company-configured approval chain - sequential, percentage-based, or hybrid - before being finalized. Admins define the rule; the engine enforces it. Every step is real-time: approvers get notified the moment an expense reaches them.

---

## Tech Stack

| Layer           | Technology                   |
| --------------- | ---------------------------- |
| Frontend        | React, Vite, Tailwind CSS    |
| Backend         | Node.js, Express             |
| Database        | PostgreSQL (Supabase)        |
| Real-time       | Socket.io                    |
| Auth            | JWT (`jti`-based revocation) |
| Session store   | Upstash Redis                |
| Validation      | Zod                          |
<!--| Frontend hosting| Vercel                       |
| Backend hosting | Railway                      | -->    

---

## Core Architecture

### Approval Engine

Every company configures exactly one active approval rule at a time, chosen from three strategies:

- **Sequential** - expenses move through an ordered chain of roles (e.g. Manager → Finance → Director), one approval unlocking the next.
- **Percentage** - all users holding a designated role vote in parallel; the expense resolves once a configured approval threshold is met.
- **Hybrid** - expenses above a configured amount route directly to a single override approver (e.g. CFO); everything else follows a default sequential chain.

Rules are stored append-only, so every configuration change is preserved as history rather than overwritten.

### Authentication & Session Revocation

Standard JWT authentication is extended with real logout support: each token carries a `jti` claim, and revoked tokens are recorded by that identifier - not the full token string - in Redis, with a TTL matching the token's remaining lifetime. If Redis is unreachable, the system fails open rather than locking out every user.

### Notifications

Socket.io pushes real-time updates on every approval-chain transition: the next approver is notified the moment it's their turn, and the submitter is notified on final approval or rejection.

---

## Key Features

- **Configurable approval workflows** - admins choose and tune the routing strategy per company without a deploy.
- **Strict RBAC** - employee, manager, finance, director, cfo, and admin roles are enforced at both the route and query level, including tenant isolation on analytics data.
- **Real-time updates** - approvers and submitters see status changes instantly, no polling.
- **Schema-validated input** - request bodies are validated upstream via Zod, keeping controllers focused on business logic.
- **Full approval audit trail** - every step of an expense's approval history is queryable, including who acted, when, and with what comment.

---

## Screenshots

_Coming soon_

## System Design

_Coming soon_

## Database Schema

_Coming soon_

---

## Local Setup

### Prerequisites

- Node.js 18+
- A Supabase project (PostgreSQL)
- An Upstash Redis database

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/Aditya2550/Reimbursement-Management.git
cd Reimbursement-Management
\`\`\`

### 2. Backend setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
\`\`\`

Fill in `.env` with your Supabase connection string, JWT secret, and Upstash Redis credentials.

\`\`\`bash
npm run seed # optional: populates demo company + users
npm run dev
\`\`\`

### 3. Frontend setup

\`\`\`bash
cd frontend
npm install
cp .env.example .env
\`\`\`

Set `VITE_API_URL` and `VITE_SOCKET_URL` to your backend's address (e.g. `http://localhost:5000/api` and `http://localhost:5000`).

\`\`\`bash
npm run dev
\`\`\`

---

## Project Status

Under active development - moving through cleanup, cloud migration, full functionality, DevOps tooling, and final polish phases.

---

## License

MIT - see [LICENSE](./LICENSE).
