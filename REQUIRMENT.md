# Project Plan: Personal Full-Stack Dynamic Portfolio

## Overview
A dynamic, modern full-stack portfolio allowing full content management via an authenticated Admin Dashboard. Features fluid animations powered by GSAP.

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, GSAP
- Backend: Node.js, Express.js, Prisma 7, PostgreSQL
- Validation & Security: Zod, JWT-based Admin Authentication, CORS, Rate Limiting
- Media Handling: Cloudinary  (for project & certificate assets)

## Route Architecture
### 1. Public Facing
- `/` (Single Page Layout with GSAP ScrollTriggers):
  - Navbar, Hero, About, Skills, Experience, Featured Projects, Certifications, Extracurricular, Contact Form, Footer
- `/projects`: Paginated / filterable list of all projects
- `/projects/:slug`: Detailed case study page (overview, tech stack, screenshots, live links)

### 2. Admin Dashboard (Protected Route: `/admin/*`)
- Authentication: Secure single-admin login
- Content Management (CRUD):
  - Projects (add, edit, delete, mark as featured)
  - Experience & Certifications
  - Skills (categorized: frontend, backend, tools)
  - Profile / About & Contact Information
  - Contact Form Submissions inbox

## Backend & API Standards
- Clean, modular layered architecture (Controller, Service, Route).
- Strict request validation using Zod schemas matching Prisma models.
- Centralized error-handling middleware and unified response format.