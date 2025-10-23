# Weezy's API service

This service manages the **API** setup for the Weezy project, providing both **REST API** and **GraphQL** endpoints.

Base URL: `http://localhost:8000/`

---

## Setup

Populate your `.env` as per `.env.example` file:

> **Note:**  
> Use the same `DATABASE_URL` as in `@weezy/prisma/.env`.

```bash
cp .env.example .env
pnpm install
```

---

## Development

Start the development server:

```bash
pnpm dev
```

---

## More

For details on using the REST API and GraphQL, refer to their respective documentation:

- [GraphQL](graphql/README.md)
- [REST](rest/README.md)

---
