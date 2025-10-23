# Weezy's DB service

This service manages the **PostgreSQL database** and **Prisma ORM** setup for the Weezy project.

---

#### Setup

Populate your `.env` as per `.env.example` file:

```bash
cp .env.example .env
pnpm install
```

---

#### Prisma Commands

| Command              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `pnpm dev`           | Starts Docker, connects Prisma, and runs `generate`. |
| `pnpm dev:no-docker` | Runs Prisma without Docker.                          |

---

#### Ports

- **Postgres** → `localhost:5432`
- **Redis** → `localhost:6379`

---
