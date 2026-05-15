# Multi-Tenant Showcase Platform

A scalable multi-tenant platform for generating modern showcase websites for local businesses.

The project is designed around:

- reusable templates
- dynamic sections
- centralized configurations
- modular architecture
- scalable multi-site management

---

# Vision

The goal is to transform traditional custom website development into a scalable infrastructure for creating high-quality showcase websites quickly and efficiently.

The platform is built to support:

- hotels & resorts
- wineries
- restaurants
- beauty centers
- professional studios
- local businesses

---

# Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Config-driven architecture
- Dynamic Section Renderer

Future integrations:

- Supabase
- Multi-tenant dashboard
- CMS-like editing system

---

# Project Structure

```txt
/src
  /app
  /components
  /config
  /data
  /lib
  /scripts
  /templates
```

Architecture principles:

- reusable components
- modular sections
- centralized site configuration
- scalable template system
- dynamic rendering

---

# Available Scripts

## Development

```bash
npm run dev
```

Starts the local development server using Next.js.

Used for:

- local development
- testing templates
- building new sections
- debugging

---

## Production Build

```bash
npm run build
```

Runs the template/site index generator before creating the production build.

Flow:

1. Executes:

   ```bash
   tsx src/scripts/build-index.ts
   ```

2. Generates dynamic indexes/configuration files
3. Builds the Next.js application for production

---

## Start Production Server

```bash
npm run start
```

Starts the production server after the project has been built.

---

## Lint

```bash
npm run lint
```

Runs ESLint checks across the project to detect:

- code issues
- style inconsistencies
- potential bugs

---

## Lint & Fix

```bash
npm run lint:fix
```

Automatically fixes linting issues where possible.

---

## Generate Dynamic Indexes

```bash
npm run index:generate
```

Executes:

```bash
tsx src/scripts/build-index.ts
```

Used to generate dynamic indexes and internal configuration mappings for:

- templates
- sections
- sites
- dynamic imports
- centralized registries

Useful when:

- creating new templates
- adding sections
- updating registry-based architecture

---

# Roadmap

## Phase 0

Market validation and first client acquisition

## Phase 1

Dynamic rendering engine

## Phase 2

Centralized multi-tenant backend

## Phase 3

Self-service dashboard

## Phase 4

Full SaaS platform

---

# Goal

Build a scalable ecosystem capable of generating high-quality digital experiences for local businesses through reusable infrastructure and modular architecture.
