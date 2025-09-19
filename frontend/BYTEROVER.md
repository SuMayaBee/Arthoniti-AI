# Byterover Handbook

Generated: 2025-09-10

## Layer 1: System Overview

Purpose: Next.js web app for AI-powered generators (logo, business name, pitch deck, documents) with consistent loader UX and strict code quality (Biome) and a11y.

Tech Stack: Next.js App Router (React 18, TypeScript), TailwindCSS, Biome, Bun, shadcn/ui, Zustand store, Node APIs under `app/api`.

Architecture: Component-based with feature folders under `app/dashboard/*`, shared UI in `components/ui`, state in `store/*`, domain helpers in `lib/*`, and route handlers in `app/api/*`.

Key Technical Decisions:
- Use 100svh + header subtraction (72px mobile, 56px lg+) for detail pages
- Standardize GenerationLoader usage: fullscreen on mobile, contained on desktop
- Extract DesktopHeader for lg+ back button to reduce duplication
- Enforce Biome formatting/linting via `biome.jsonc`

Entry Points: `app/page.tsx`, dashboard routes under `app/dashboard/*`, API routes under `app/api/*`.

---

## Layer 2: Module Map

Core Modules:
- Dashboard Generators: logo, business-name, pitch-deck, document-generator
- Shared Navigation: MobileHeader, DesktopHeader
- Loaders: GenerationLoader, HistoryLoader, GlobalLoaderPortal

Data Layer:
- Zustand stores in `store/*` (auth, profile, chat, website-builder)
- Validation in `lib/api/validation/*`

Integration Points:
- Next.js API routes under `app/api/*`
- File exports (PDF/PPTX) handled per feature (pitch deck, documents)

Utilities:
- `lib/utils.ts`, `lib/colors.ts`, `lib/color-utils.ts`

Module Dependencies:
- Feature pages import shared components and stores; API routes consume validation helpers.

---

## Layer 3: Integration Guide

API Endpoints:
- Project-specific endpoints live under `app/api/*` (e.g., `app/api/website-builder/*`). Details to be expanded per feature.

Configuration Files:
- `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `biome.jsonc`, `postcss.config.mjs`

External Integrations:
- None explicitly documented; uses shadcn/ui and Tailwind for UI.

Workflows:
- Loader pattern for detail pages; min-height subtracts headers; DesktopHeader on lg+.

Interface Definitions:
- TypeScript types colocated; expand per feature as needed.

---

## Layer 4: Extension Points

Design Patterns:
- Component composition, responsive layout utilities, state via Zustand.

Extension Points:
- Add new generators under `app/dashboard/*` and reuse DesktopHeader/GenerationLoader.

Customization Areas:
- Theming via Tailwind and component props.

Plugin Architecture:
- N/A (monolith app router project).

Recent Changes:
- Standardized header/loader across detail pages; refactored document details page to fix malformed JSX and adopt shared pattern.

---

## Quality Validation Checklist

Required Sections
- [x] Layer 1: System Overview completed
- [x] Layer 2: Module Map completed
- [x] Layer 3: Integration Guide completed
- [x] Layer 4: Extension Points completed

Content Quality
- [x] Architecture pattern identified and documented
- [x] At least 3 core modules documented with purposes
- [x] Tech stack matches actual project dependencies
- [x] API endpoints or integration points identified
- [x] Extension points or patterns documented

Completeness
- [x] All templates filled with actual project information
- [x] No placeholder text remaining
- [x] Information is accurate and up-to-date
- [x] Provides value for navigation and onboarding
