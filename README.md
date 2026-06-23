# PQC Cloud Storage

PQC Cloud Storage is a zero-knowledge secure cloud storage platform designed to withstand tomorrow's quantum threats today. Built as a final year group project, the application ensures absolute privacy by enforcing a strict zero-knowledge trust boundary: every file is encrypted entirely within the user's browser before it is transmitted over the network.

The server acts solely as a blind coordinator and data store. It handles only ciphertext, metadata, and encrypted cryptographic packages—never catching a glimpse of your plaintext files, encryption keys, or account password.

By implementing the newly standardized Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM), this platform brings state-of-the-art post-quantum cryptography out of academic theory and into a functional, full-stack web application.

---

## Features

* **Browser-Side End-to-End Encryption:** All cryptographic operations take place locally inside the user's browser utilizing the native Web Crypto API and optimized WASM packages.
* **Zero-Knowledge Architecture:** The backend infrastructure is mathematically incapable of accessing user data, hosting only encrypted blobs and isolated wrappers.
* **Post-Quantum Cryptography (ML-KEM-768):** Protects session-level keys using NIST FIPS 203 standardized lattice-based cryptography.
* **Authenticated Symmetric Encryption:** Core file data is sealed via AES-256-GCM, ensuring high-speed data confidentiality and tampering detection.
* **Hardened Key Derivation:** Uses memory-hard Argon2id parameter tuning to derive master keys locally, neutralizing offline GPU/ASIC brute-force attacks.
* **Object Storage Integration:** Securely pipelines encrypted binaries into private Cloudflare R2 buckets.
* **Granular Access Controls:** Supports temporary session management via JWTs (HttpOnly), strict storage quotas, individual file count bounds, and maximum download thresholds.
* **Automated Ephemerality:** Supports self-destruct settings that automatically purge files based on expiration clocks or download limits.
* **Immutable Audit Logging:** Tracks comprehensive lifecycle events (uploads, downloads, and deletions) for transparency.

---

## Why This Project Matters

Most traditional cloud storage solutions rely heavily on RSA or Elliptic Curve Cryptography (ECC) to negotiate keys. However, these mathematical problems are trivial to solve under Shor’s algorithm running on a sufficiently large quantum computer.

While fault-tolerant quantum hardware is still evolving, the danger is immediate through an adversarial strategy known as **Harvest Now, Decrypt Later**. Attackers are actively intercepting and storing encrypted data packets today, waiting for the hardware to mature to decrypt it retroactively. For healthcare histories, state secrets, and core intellectual properties that must stay confidential for decades, this poses a pressing risk.

In August 2024, NIST officially standardized ML-KEM under FIPS 203. Major industry pillars like Google and Cloudflare have actively started rolling out support across their network infrastructures. This project showcases a real-world, full-stack implementation of these defense paradigms.

---

## Architecture

```
  [ Browser / Client ] 
          │
          ▼ (Encrypted payloads only)
  [ Node.js Backend ]
       ┌──┴────────┐
       ▼           ▼
  [ MongoDB ]  [ Cloudflare R2 ]

```

### Component Responsibilities

* **Browser:** Handles raw client passwords, generates ML-KEM key pairs, derives local master keys, handles session keys in temporary memory, and performs all file encryption/decryption.
* **Backend Server:** Authenticates sessions via secure JWT cookies, evaluates individual user storage quotas, tracks asset parameters, dictates immutable auditing hooks, and signs temporary object URLs.
* **MongoDB:** Stores user account models (with bcrypt-hashed credentials), public keys, metadata structures, configuration attributes, access logs, and encrypted AES key blobs (`mlkemCiphertext`).
* **Cloudflare R2:** Hosts raw, standalone encrypted file payloads assigned to isolated UUID keys. No public paths are available.

> **Zero-Visibility Guarantee:** The backend environment never encounters your plaintext files, your plaintext private keys, your plaintext symmetric AES keys, or your master password.

---

## Cryptographic Design

### User Registration & Key Derivation

```
Password + Email ──► Argon2id (m=64MB, t=3, p=1) ──► Master Key (256-bit)
                                                           │
Seed (CSPRNG) ──► ML-KEM-768 Pair ──► Private Key ◄────────┴──► AES-256-GCM Encrypt ──► Server

```

### File Upload (KEM-DEM Hybrid Construction)

```
File Data ──► AES-256-GCM (Random Key & IV) ───────────────────────────► Cloudflare R2 (Ciphertext)

                                    ┌──► KEM Ciphertext (1088B)
Random AES Key ──► ML-KEM Encap ────┤
                                    └──► Shared Secret ──► HKDF ──► Wrapping Key
                                                                        │
                                   Wrapped AES Key (48B) ◄──────────────┴── AES-256-GCM Encrypt

```

The resulting `mlkemCiphertext` field stored in MongoDB is packaged as: `[ KEM Ciphertext (1088B) | wrapIv (12B) | Wrapped Key (48B) ]`.

### File Download (Decapsulation & Decryption)

```
mlkemCiphertext ──► Extract Components ──► ML-KEM Decap(Private Key) ──► Shared Secret
                                                                              │
Raw File Data ◄── AES-256-GCM Decrypt ◄── Unwrapped AES Key ◄── HKDF-SHA256 ◄─┘

```

---

## Security Properties

* **What if MongoDB leaks?** The attacker gets encrypted file keys, public keys, and encrypted private keys. They cannot decrypt the file keys without the private keys, and they cannot decrypt the private keys without the user's master password, which is protected by memory-hard Argon2id parameters.
* **What if Cloudflare R2 leaks?** The attacker gets random UUID blobs of raw ciphertext. Without the metadata or individual AES keys stored in MongoDB, these files are completely unidentifiable and mathematically unreadable.
* **What if MongoDB and R2 leak together?** The attacker possesses both matching components, yet still cannot bypass the core cryptographic boundaries. Without decapsulating via the user’s master-password-protected private key, the files remain secure.
* **What if the Backend is compromised?** The attacker controls the routing mechanism but cannot inspect data retroactively, as the backend is never supplied with the structural keys or passwords needed to reverse the encryption.
* **Trust Boundary:** The trust boundary begins and ends strictly inside the user's browser. The outer network layer is viewed as entirely untrusted.

### Known Limitations

* **XSS Exposure:** Because decrypted private keys are momentarily kept in `sessionStorage` during a live dashboard session, an active Cross-Site Scripting (XSS) exploit inside the browser tab could potentially intercept active session material. This is a standard architectural tradeoff faced by all browser-based zero-knowledge setups (e.g., Proton Drive, Bitwarden). The platform mitigates this through a highly restrictive Content Security Policy (CSP).

---

## Relevance and Real-World Use Cases

The "Harvest Now, Decrypt Later" strategy makes immediate post-quantum preparation crucial across several spaces:

* **Healthcare (HIPAA):** Protects long-term medical histories, biometric definitions, and clinical trial records that remain sensitive over generations.
* **Legal Systems:** Preserves attorney-client confidentiality logs, litigation blueprints, and sensitive deposition archives.
* **Journalism & Activism:** Offers secure communication spaces for whistleblowers and document storage for investigative reporters requiring definitive anonymity.
* **Defense & Government:** Secures tactical operational frameworks, geopolitical communication assets, and infrastructure data requiring long-term security.
* **Finance & Corporate IP:** Shields critical M&A terms, proprietary automated trading formulas, and pending patent applications from future industrial espionage.

---

## Tech Stack

* **Frontend:** Next.js (App Router), TypeScript, TailwindCSS, Native Web Crypto API
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT)
* **Database:** MongoDB (Mongoose Object Modeling)
* **Cloud Storage:** Cloudflare R2 (S3-Compatible API Platform)
* **Core Crypto Engines:** `mlkem` (FIPS 203 Native NPM Ecosystem Package), `@noble/hashes` (Argon2id, HKDF-SHA256, SHA2)

---

## Setup

### Prerequisites

Ensure you have Node.js (v18+) and npm installed locally.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pqc-cloud-storage.git
cd pqc-cloud-storage

# Set up backend dependencies
cd backend
npm install

# Set up frontend dependencies
cd ../frontend
npm install

```

### Environment Configuration

Create an `.env` file in the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
R2_ACCESS_KEY_ID=your_cloudflare_r2_key
R2_SECRET_ACCESS_KEY=your_cloudflare_r2_secret
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT=your_s3_compatible_endpoint_url
JWT_SECRET=your_jwt_signing_key

```

Create an `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

```

### Execution

```bash
# In the backend directory
npm run dev

# In the frontend directory
npm run dev

```

The client app runs on `http://localhost:3000` and proxies coordination requests to `http://localhost:5000`.

---
