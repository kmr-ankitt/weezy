# Weezy

A lightweight, extensible workflow orchestration system inspired by n8n and Temporal, built with a DAG-based execution model, queue-driven processing, and a modular node architecture.

## Tech Stack

Next.js, Express, GraphQL, BullMQ, Redis, PostgreSQL, Prisma, Turborepo

## Features

This project allows you to:

- Design and manage custom workflows.
- Automate tasks across distributed systems.
- Monitor workflow execution and user activity.
- Integrate with external services and data sources.

The goal is to give developers full control while maintaining modular, scalable automation.

It focuses on:

- Workflows as Directed Acyclic Graphs (DAGs)
- Deterministic execution
- Horizontal scalability
- Extensible integrations
- Clear separation between orchestration and execution

## Installation and Running

- Clone this repository

```bash
git clone https://github.com/kmr-ankitt/weezy.git
cd weezy
```

> **Note:**  
> populate `.env` inside `@weezy/prisma/` & `@weezy/api` before running.

- Run application

```bash
pnpm --filter @weezy/prisma db:push
pnpm dev
```

| Service       | URL                   |
| ------------- | --------------------- |
| Frontend      | http://localhost:3000 |
| API / GraphQL | http://localhost:8000 |

- Start the worker (in a separate terminal)

```bash
pnpm worker
```

> The worker process must be running for workflow executions to be processed.

## License

[MIT](LICENSE)
