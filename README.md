# GenBridge

A self-learning platform that helps parents and teachers understand Gen-Alpha culture, slang, and internet terminology through structured lessons, quizzes, quests, and community discussion.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Data Model](#data-model)

---

## Overview

GenBridge bridges the generational gap by providing structured, admin-curated lessons on modern slang and internet culture. Learners earn XP and streaks by completing lessons and quizzes, take on offline quests, and engage with a community forum.

---

## Tech Stack

### Backend
- **Java 17** + **Spring Boot 3.2.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** (Hibernate ORM)
- **PostgreSQL** (hosted on Supabase)
- **SpringDoc OpenAPI** (Swagger UI at `/swagger-ui.html`)
- **Maven** build tool

### Frontend
- **React 18** + **TypeScript**
- **Vite 5** (build tool, SWC compiler)
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **React Router DOM 6** (client-side routing)
- **Axios** (HTTP client with JWT interceptors)
- **TanStack React Query 5** (server-state management)
- **React Hook Form** + **Zod** (form validation)
- **Framer Motion** (animations)
- **Recharts** (data visualisation)

### Infrastructure
- **Backend**: Railway (Docker-based PaaS, auto-deploy on push)
- **Frontend**: Vercel (Jamstack, API rewrites to Railway)
- **Database**: Supabase (managed PostgreSQL)

---

## Architecture

```
┌──────────────────────────────────────┐
│  React 18 + TypeScript (Vite)        │
│  Deployed on Vercel                  │
└────────────────┬─────────────────────┘
                 │ HTTPS / REST JSON
                 ↓
┌──────────────────────────────────────┐
│  Spring Boot 3.2.2 REST API          │
│  Deployed on Railway                 │
└────────────────┬─────────────────────┘
                 │ JPA / Hibernate
                 ↓
┌──────────────────────────────────────┐
│  PostgreSQL (Supabase)               │
└──────────────────────────────────────┘
```

### Backend Package Structure

```
com.genbridge.backend/
├── auth/           # Auth DTOs and AuthController
├── config/         # Security, JWT, CORS, OpenAPI, data seeders
├── controller/     # REST controllers
├── dto/            # Request/response DTOs
├── entity/         # JPA entities
├── repository/     # Spring Data JPA repositories
├── services/       # Business logic
└── user/           # User entity and service
```

### Frontend Directory Structure

```
src/
├── pages/          # Route-level components
├── components/     # Reusable UI components
├── services/       # Axios API client
├── context/        # Theme (dark mode) context
├── hooks/          # Custom React hooks
└── lib/            # Utility functions
```

---

## Features

### Learners (Parents / Teachers)
- Browse and read published lessons about Gen-Alpha culture
- Take multiple-choice quizzes and earn XP on completion
- Track daily streaks and total XP on your profile
- Complete offline quests with reflection submissions
- Post and comment in the community forum
- Report factual errors in lesson content

### Admins
- Create, edit, publish, and delete lessons with vocabulary terms
- Manage quiz questions (add, update, delete per lesson)
- Create and manage offline quests
- View and resolve content reports (3 open reports auto-unpublish a lesson)
- Moderate forum posts and comments
- Warn or suspend users who violate community guidelines

### Access Control
| Role | Permissions |
|------|-------------|
| **LEARNER** | Read published lessons, take quizzes, post in forum, complete quests |
| **ADMIN** | Full CRUD on all content, user moderation |

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+ / npm 9+
- A running PostgreSQL instance (or use the Supabase credentials in `application.properties`)

### Run Everything at Once

```bash
npm run dev
```

This starts both services concurrently:
- **Backend** on `http://localhost:8080`
- **Frontend** on `http://localhost:5173` (proxies `/api` to backend)

### Run Separately

```bash
# Terminal 1 — Backend
npm run backend:dev
# or: ./mvnw spring-boot:run

# Terminal 2 — Frontend
npm run ui:dev
# or: cd src/main/java/com/genbridge/frontend && npm run dev
```

### Build for Production

```bash
# Backend JAR
./mvnw clean package

# Frontend static assets
npm run ui:build
# Output: src/main/java/com/genbridge/frontend/dist/
```

### Default Admin Account

On first startup, a seed admin is created automatically:

| Field | Value |
|-------|-------|
| Email | `admin@genbridge.com` |
| Password | `Admin@12345` |

---

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Database password |
| `JWT_SECRET` | HS256 secret (32+ chars) |
| `ADMIN_EMAIL` | Seed admin email |
| `ADMIN_PASSWORD` | Seed admin password |
| `SPRING_PROFILES_ACTIVE` | Set to `prod` in production |

Development defaults are in `src/main/resources/application.properties`.
Production config reads from env vars via `application-prod.properties`.

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (defaults to `/api`) |

---

## API Documentation

Full API documentation is available via Swagger UI when the backend is running:

```
http://localhost:8080/swagger-ui.html
```

---

## Testing

### Backend

```bash
./mvnw test
```

Uses JUnit 5 with Spring Boot Test.

### Frontend

```bash
npm run ui:test        # Run once
npm run test:watch     # Watch mode
```

Uses Vitest and React Testing Library.

---

## Deployment

### Backend — Railway

1. Push the repository to GitHub.
2. Connect Railway to the GitHub repo.
3. Set the following environment variables in Railway:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `SPRING_PROFILES_ACTIVE=prod`
4. Railway detects Maven and deploys automatically on each push.

### Frontend — Vercel

1. Connect Vercel to the GitHub repo.
2. Set the root directory to `src/main/java/com/genbridge/frontend`.
3. Set `VITE_API_URL` to the Railway backend URL.
4. Vercel builds with Vite and serves the SPA; `vercel.json` rewrites `/api/*` to Railway and all other paths to `index.html`.

### Database — Supabase

No manual schema migration needed. Hibernate auto-creates and updates the schema on first startup (`spring.jpa.hibernate.ddl-auto=update`). Ensure the Supabase connection string and credentials are provided via environment variables.

---

### Key Business Rules

- **XP per quiz**: Beginner = 10 XP, Intermediate = 15 XP, Advanced = 20 XP
- **Lesson completion**: All quiz questions must be answered correctly in a single submission
- **Content report threshold**: 3 open reports automatically unpublish a lesson
- **Streaks**: Incremented daily on lesson start or quiz submission; resets if a day is missed
- **Quest submissions**: One reflection per user per quest (enforced at DB level)

---

## Team

CS203 G1 Team 5 — SMU School of Computing and Information Systems

Divyesh · Tian Le · Tanish · Danush · Yujia · Zhuo Yu
