#  PQC Cloud Storage – Backend

Backend service for a **Post-Quantum Cryptography based Secure Cloud Storage System**.
Implements secure authentication, encrypted file handling, and advanced security APIs.

---

## Overview

This backend is built using **Node.js + Express** and powers a cloud storage system where:

* Every file is encrypted before storage
* Uses **Hybrid Encryption**

  * AES-256-GCM → File encryption
  * ML-KEM (CRYSTALS-Kyber) → Key protection
* Inspired by **NIST FIPS 203 (2024)** standard

Based on full system documentation 

---

##  Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication (Access + Refresh Tokens)
* Cloudflare R2 (S3 Storage)
* Nodemailer (OTP Email)
* Rate Limiting & Security Middleware

---

##  Setup Instructions

### 1️⃣ Prerequisites

* Node.js (v18+)
* MongoDB Atlas
* Python service running (port 8000)

---

### 2️⃣ Installation

```bash
cd backend
npm install
cp .env.example .env
```

---

### 3️⃣ Run Server

```bash
npm run dev
```

Expected Output:

```
MongoDB connected
Backend running on port 5000
```

---

##  Environment Variables

Create `.env` file inside `backend/`

```env
PORT=5000
MONGO_URI=your_mongodb_uri

JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRES=7d
JWT_REFRESH_EXPIRES=7d

COOKIE_SECRET=your_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email
EMAIL_PASS=app_password

R2_ENDPOINT=your_r2_endpoint
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=pqc-files

CRYPTO_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:3000
```

Never commit `.env`

---

##  Core Features

*  JWT Authentication (Login, Refresh, Logout)
*  OTP-based Email Verification
*  Secure File Upload & Download
*  File Sharing with Expiry Links
*  Activity Logging
*  File Security Scoring
* File Integrity Check (SHA-256)
*  Cryptographic Audit Trail (Hash Chain)
*  Multi-device Session Management
*  File Versioning

---

##  API Endpoints

###  Auth APIs

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/auth/register        |
| POST   | /api/auth/verify-otp      |
| POST   | /api/auth/login           |
| POST   | /api/auth/refresh         |
| POST   | /api/auth/logout          |
| GET    | /api/auth/me              |
| PUT    | /api/auth/change-password |

---

###  File APIs

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | /api/files/upload        |
| GET    | /api/files               |
| GET    | /api/files/download/:id  |
| DELETE | /api/files/:id           |
| POST   | /api/files/share/:id     |
| GET    | /api/files/shared/:token |

---

###  Security APIs

| Method | Endpoint                        |
| ------ | ------------------------------- |
| GET    | /api/security/dashboard         |
| GET    | /api/security/score             |
| POST   | /api/security/integrity/:fileId |
| GET    | /api/security/audit             |
| GET    | /api/security/audit/verify      |
| GET    | /api/security/sessions          |

---

##  Encryption Workflow

1. File encrypted using AES-256-GCM
2. AES key encrypted using ML-KEM
3. SHA-256 hash generated
4. File stored in Cloudflare R2
5. Metadata stored in MongoDB

---

##  Security Score System

| Feature       | Points |
| ------------- | ------ |
| ML-KEM PQC    | 40     |
| SHA-256 Hash  | 20     |
| Self-Destruct | 15     |
| Private File  | 15     |
| AES-GCM Tag   | 10     |

---

##  Folder Structure

```
backend/
 ├── src/
 │   ├── config/
 │   ├── models/
 │   ├── middleware/
 │   ├── controllers/
 │   ├── routes/
 │   ├── utils/
 │   └── app.js
 ├── server.js
 └── .env
```

---

##  Testing

Use Postman:

1. Register → Verify OTP
2. Login → Get accessToken
3. Add Bearer Token
4. Upload file
5. Test security APIs

---

## 🔍 Health Check

* Backend → http://localhost:5000/api/health

---

## Common Issues

* MongoDB error → Check URI
* Token expired → Increase expiry
* File upload fails → Use form-data
* Crypto service not running → Start port 8000

---

##  Author

**Anmol Gupta**
B.Tech CSE (Cybersecurity)

---

##  License

This project is for educational purposes.
