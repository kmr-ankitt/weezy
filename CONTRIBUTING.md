# Contributing Guidelines

Thank you for your interest in contributing!

---

## Project Workflow

1. **Fork or clone** the repository:

   ```bash
   git clone https://github.com/<your-username>/weezy.git
   cd weezy
   ````

2. **Create a new branch** for each change:

   ```bash
   git checkout -b feature/<short-description>
   # or
   git checkout -b bugfix/<short-description>
   ```

3. **Make your changes** and commit them clearly:

   ```bash
   git add .
   git commit -m "feat: add authentication system"
   ```

4. **Push your branch**:

   ```bash
   git push origin feature/<short-description>
   ```

5. **Open a Pull Request (PR)** into `main` on GitHub.

   * Describe what your PR does.
   * Link related issues (if any).
   * Make sure all tests/lints pass.

---

## Branch Naming Convention

| Type     | Prefix      | Example                 |
| -------- | ----------- | ----------------------- |
| Feature  | `feat/`  | `feature/dashboard-ui`  |
| Bug Fix  | `bugfix/`   | `bugfix/login-crash`    |
| Refactor | `refactor/` | `refactor/api-layer`    |

---

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>: <short summary>
```

**Types:**

* `feat` – New feature
* `fix` – Bug fix
* `docs` – Documentation change
* `style` – Code style (formatting, linting)
* `refactor` – Code refactor
* `test` – Add or fix tests
* `chore` – Build or maintenance

**Example commits:**

```
feat: add JWT authentication
fix: resolve null pointer in login handler
docs: update API usage in README
refactor: simplify middleware structure
```

---

## Testing Before Commit

Before pushing:

```bash
# Run lint and tests
pnpm lint
pnpm test
```

Make sure everything passes before pushing.

---

## Merging Workflow

* Open a Pull Request (PR) from your branch into `main`.
* Review changes and ensure:

  * No merge conflicts
  * Tests pass
  * Commit messages follow conventions
* Merge with **Squash and Merge** to keep history clean.

_Happy breaking and fixing!_

---
