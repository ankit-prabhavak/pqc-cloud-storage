# PQC Cloud Storage

A post-quantum cryptography based secure cloud storage system built as a final year group project. Files are encrypted before being stored in the cloud, making the system resistant to future quantum computing attacks.

---

## Overview

Current cloud storage systems rely on encryption algorithms like RSA and ECC, which may become vulnerable once quantum computers become practical. This system addresses that by combining AES-256-GCM for fast file encryption with CRYSTALS-Kyber (ML-KEM) for quantum-resistant key encapsulation, making it both efficient and future-proof.

---

## Tech Stack

**Frontend** — Next.js, TypeScript, Tailwind CSS

**Backend** — Node.js, Express, MongoDB, JWT

**Crypto Service** — Python, FastAPI, AES-256-GCM, ML-KEM (Kyber)

**Cloud Storage** — Cloudflare R2 or AWS S3
