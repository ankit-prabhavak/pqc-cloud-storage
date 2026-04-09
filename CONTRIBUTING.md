# Contributing to PQC Cloud Storage

This document explains how to work on this project as a team. Read it fully before writing any code.

---

## Who manages what

| Member | Role | Owns | Branch |
|--------|------|------|--------|
| Ankit | Project lead | Reviews all PRs, merges into main, resolves conflicts | feature/auth |
| Member 2 | Backend developer | File upload API, multer, R2 integration | feature/file-upload |
| Member 3 | Frontend developer | Dashboard UI, file list, upload interface | feature/frontend-ui |
| Member 4 | Frontend developer | Auth pages, login, register, routing | feature/frontend-auth |
| Member 5 | Crypto developer | Python crypto service, AES, mock Kyber | feature/crypto |
| Member 6 | Database developer | Mongoose models, MongoDB, cloud storage config | feature/database |

---

## First time setup

### Step 1 — Clone the repo

```bash
git clone https://github.com/ankit-prabhavak/pqc-cloud-storage.git
cd pqc-cloud-storage
```

### Step 2 — Switch to dev branch

```bash
git checkout dev
git pull origin dev
```

### Step 3 — Switch to your feature branch

```bash
git checkout feature/your-branch-name
```

### Step 4 — Set up your service

**Frontend:**
```bash
cd frontend
npm install
cp ../.env.example .env.local
npm run dev
```

**Backend:**
```bash
cd backend
npm install
cp ../.env.example .env
npm run dev
```

**Crypto service:**
```bash
cd crypto-service
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Step 5 — Fill in your .env

Copy `.env.example` and fill in values. Ask Ankit for shared credentials like MongoDB URI and R2 keys.

Never commit a `.env` file with real credentials. It is in `.gitignore` for this reason.

---

## Daily workflow

Follow this every single day before you start working.

```bash
# 1. go to dev and pull latest
git checkout dev
git pull origin dev

# 2. go to your branch
git checkout feature/your-branch-name

# 3. bring your branch up to date with dev
git merge dev

# 4. write your code

# 5. stage and commit
git add .
git commit -m "type: short description of what you did"

# 6. push your branch
git push origin feature/your-branch-name
```

When your feature is ready, open a Pull Request on GitHub from your branch into `dev`. Do not merge it yourself — Ankit reviews and merges all PRs.

---

## Commit message format

Every commit message must follow this format:

```
type: short description in lowercase
```

| Type | When to use |
|------|-------------|
| `feat` | adding new functionality |
| `fix` | fixing a bug |
| `chore` | config, dependencies, setup |
| `docs` | updating documentation |
| `refactor` | restructuring code without changing behavior |
| `style` | formatting, spacing, no logic changes |

Examples of good commit messages:
```
feat: add JWT middleware to protect routes
fix: correct AES decryption returning empty buffer
chore: update requirements.txt with pydantic version
docs: add endpoint descriptions to README
refactor: move file upload logic into controller
```

Examples of bad commit messages:
```
update
fixed stuff
working now
asdfjkl
```

Bad commit messages will be asked to be rewritten before the PR is merged.

---

## Pull Request rules

When you open a Pull Request:

- Title must describe what the PR does, not just the branch name
- Add a short description of what you changed and why
- Link to any related issue if one exists
- Make sure your branch is up to date with dev before opening the PR
- Do not merge your own PR
- Wait for Ankit to review

Ankit will either approve and merge, or leave review comments asking for changes. If changes are requested, fix them on your branch and push again — the PR updates automatically.

---

## Branch rules

- Never push directly to `main`
- Never push directly to `dev`
- Always work on your own feature branch
- Only Ankit merges feature branches into `dev`
- Only Ankit merges `dev` into `main` at the end of each phase

---

## Resolving merge conflicts

If you get a merge conflict after running `git merge dev`:

1. Open VS Code — conflicting files will be highlighted
2. Look for sections marked `<<<<<<< HEAD` and `>>>>>>> dev`
3. Decide which version to keep, or combine both manually
4. Save the file
5. Run:
```bash
git add .
git commit -m "fix: resolve merge conflict with dev"
git push origin feature/your-branch-name
```

If you are unsure how to resolve a conflict, do not guess. Ask Ankit first.

---

## Code style rules

### JavaScript and TypeScript

- Use `const` by default, `let` only when you need to reassign
- Use `async/await` not `.then()` chains
- Always handle errors with `try/catch` in async functions
- Name variables and functions clearly — `encryptFile` not `ef`
- One function does one thing

```js
// good
const encryptFile = async (fileBuffer, encryptionType) => {
  try {
    const response = await cryptoService.encrypt(fileBuffer, encryptionType)
    return response.data
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`)
  }
}

// bad
const ef = async (f, t) => {
  const r = await axios.post('/encrypt', { f, t })
  return r
}
```

### Python

- Follow PEP 8 — 4 spaces for indentation
- Type hints on all function parameters and return values
- Keep functions small and single-purpose

```python
# good
def encrypt_file(data: bytes, key: bytes) -> tuple:
    iv = os.urandom(12)
    aesgcm = AESGCM(key)
    encrypted = aesgcm.encrypt(iv, data, None)
    return encrypted, iv

# bad
def enc(d, k):
    i = os.urandom(12)
    return AESGCM(k).encrypt(i, d, None), i
```

---

## What not to commit

The `.gitignore` already handles most of this, but be aware:

- Never commit `.env` files with real credentials
- Never commit `node_modules/`
- Never commit `venv/` or `__pycache__/`
- Never commit `.next/` build output
- Never commit API keys, secrets, or passwords anywhere in the code

If you accidentally commit a secret, tell Ankit immediately so it can be rotated.

---

## Project structure reminder

```
pqc-cloud-storage/
├── frontend/          Member 3 and Member 4
├── backend/           Ankit and Member 2 and Member 6
├── crypto-service/    Member 5
├── .env.example       source of truth for environment variables
└── CONTRIBUTING.md    this file
```

Only touch files inside your own service unless you have discussed it with Ankit first. Crossing into another person's service without coordination causes conflicts and confusion.

---

## Communication

- If you are blocked for more than 30 minutes, ask in the group chat
- If you are going to miss a deadline, say so early
- If you break something on dev, tell the team immediately
- All technical decisions that affect more than one service go through Ankit first

---

## Phase completion checklist

Before Ankit merges `dev` into `main` at the end of a phase, every member must confirm:

- My feature works end to end
- I have tested it manually
- My branch is merged into dev
- No console errors or unhandled exceptions
- No hardcoded credentials in my code

---

## Questions

If anything in this document is unclear, ask Ankit before making assumptions.