# Contributing to PQC Cloud Storage

This guide outlines our team's workflow and coding standards. Read it before writing or pushing any code.

---

## First Time Setup

### 1. Clone & Branch Setup

```bash
git clone https://github.com/ankit-prabhavak/pqc-cloud-storage.git
cd pqc-cloud-storage

# Switch to the shared development branch
git checkout dev
git pull origin dev

# Create and switch to your feature branch
git checkout -b feature/your-feature-name

```

### 2. Service Initialization

* **Frontend (Next.js):**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev

```


* **Backend (Node.js/Express):**
```bash
cd backend
npm install
cp .env.example .env
npm run dev

```



> **Note on Credentials:** Fill out your local `.env` files. Ask Ankit for shared development credentials (MongoDB URI, Cloudflare R2 keys). **Never commit active credentials to GitHub.**

---

## Daily Git Workflow

Always sync with the main development track before making or submitting changes.

```bash
# 1. Sync local dev branch with remote
git checkout dev
git pull origin dev

# 2. Rebase/Merge changes into your feature branch
git checkout feature/your-feature-name
git merge dev

# 3. Code, then stage and commit your changes
git add .
git commit -m "type: short description"

# 4. Push branch to GitHub
git push origin feature/your-feature-name

```

*When your feature is complete, open a **Pull Request (PR)** from your branch into `dev` on GitHub. Do not merge it yourself; code reviews are mandatory.*

---

## Commit & Branch Rules

### Commit Format

Messages must look like: `type: lowercase description`.

* `feat`: New user-facing functionality
* `fix`: Security patch or bug fix
* `chore`: Build steps, dependencies, or configuration updates
* `docs`: Editing documentation or code comments
* `refactor`: Changing code layout without altering functionality

*Good:* `feat: add client-side web crypto key generation`

*Bad:* `fixed stuff` / `working now`

### Branch Guidelines

* Never push directly to `main` or `dev`.
* Address all PR review feedback before requesting a final merge.
* Resolve merge conflicts locally in VS Code by comparing `HEAD` against `dev`, cleaning up conflict markers, and committing the resolution.

---

## Clean Code Conventions

### JavaScript / TypeScript (Next.js & Node.js)

* **Variables:** Use `const` by default; use `let` only if reassignment is explicitly required.
* **Asynchronous Patterns:** Always use `async/await` syntax instead of old `.then()` promise chains.
* **Error Handling:** Wrap all asynchronous operations and API network calls in clear `try/catch` statements.
* **Clarity:** Write descriptive variable and method titles (`encryptFileBuffer` over `ef`). Functions should focus on a single job.

---

## Repository Architecture

```text
pqc-cloud-storage/
├── frontend/        # Next.js UI + Web Crypto API (Browser Cryptography)
├── backend/         # Node.js Express API (Routing, Metadata, R2 Orchestration)
├── .env.example     # Environment variable template
└── CONTRIBUTING.md  # This document

```

---

## Team Communication

* **30-Minute Rule:** If you are stuck or blocked on a bug for more than 30 minutes, raise a flag in the team group chat.
* **Transparency:** If you break a component on the shared `dev` branch, notify the team immediately so it can be rolled back or patched.
* **Cross-Over:** Coordinate with team members before refactoring files outside your assigned module to prevent logical conflicts.