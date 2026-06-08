"use client";

import { useRouter } from "next/navigation";
import {
  FiShield,
  FiLock,
  FiZap,
  FiServer,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiArrowRight,
  FiCheck,
  FiFile,
  FiKey,
  FiEye,
  FiClock,
  FiChevronRight,
  FiUpload,
  FiDatabase,
} from "react-icons/fi";
import Image from "next/image";
import { Cpu, ShieldCheck, Fingerprint, TimerOff, EyeOff } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen bg-white text-gray-900 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Google Fonts — DM Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .mono { font-family: 'DM Mono', monospace; }
        .badge-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
        }
        .step-line::after {
          content: ''; position: absolute; top: 20px; left: calc(100% + 8px);
          width: calc(100% - 16px); height: 1px; background: #e5e7eb;
        }
        .feature-card {
          border: 1px solid #f0f0f0; border-radius: 16px; padding: 32px;
          background: #fff; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover { border-color: #d1d5db; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .nav-link { font-size: 14px; color: #6b7280; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: #111827; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; background: #111827; color: #fff;
          border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
        }
        .btn-primary:hover { background: #1f2937; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; background: transparent; color: #374151;
          border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: border-color 0.15s, color 0.15s;
        }
        .btn-secondary:hover { border-color: #9ca3af; color: #111827; }
        .score-bar-fill { transition: width 0.6s ease; }
        .algo-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 500;
          background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0;
        }
        .algo-tag.neutral {
          background: #f9fafb; color: #6b7280; border-color: #e5e7eb;
        }
        .section-label {
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #6b7280;
        }
        .divider { border: none; border-top: 1px solid #f3f4f6; margin: 0; }
        .hero-mockup {
          background: #fff; border: 1px solid #e5e7eb; border-radius: 20px;
          box-shadow: 0 20px 80px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .browser-bar {
          display: flex; align-items: center; gap: 6px; padding: 12px 16px;
          background: #f9fafb; border-bottom: 1px solid #e5e7eb;
        }
        .browser-dot { width: 10px; height: 10px; border-radius: 50%; }
        .url-bar {
          flex: 1; margin: 0 12px; background: #fff; border: 1px solid #e5e7eb;
          border-radius: 6px; padding: 4px 12px; font-size: 11px; color: #9ca3af;
          font-family: 'DM Mono', monospace;
        }
        .file-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; border-bottom: 1px solid #f9fafb;
          transition: background 0.1s;
        }
        .file-row:hover { background: #fafafa; }
        .file-row:last-child { border-bottom: none; }
        .encryption-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 5px; font-size: 10px;
          font-weight: 600; font-family: 'DM Mono', monospace;
          background: #f0fdf4; color: #15803d;
        }
        .encryption-chip.muted {
          background: #f9fafb; color: #9ca3af;
        }
        .stat-bar {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;
          background: #fafafa;
        }
        .stat-bar-item {
          padding: 28px 20px; text-align: center;
          border-right: 1px solid #f3f4f6;
        }
        .stat-bar-item:last-child { border-right: none; }
        .security-card {
          background: #fff; border: 1px solid #f0f0f0;
          border-radius: 16px; padding: 28px;
        }
        .check-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 0; border-bottom: 1px solid #f9fafb;
        }
        .check-item:last-child { border-bottom: none; }
        footer a { color: #6b7280; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        footer a:hover { color: #111827; }
        .footer-heading { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #9ca3af; margin-bottom: 16px; }
        .cta-section {
          background: #111827; border-radius: 24px; padding: 72px 48px;
          text-align: center; margin: 0 24px;
        }
        @media (max-width: 768px) {
          .stat-bar { grid-template-columns: repeat(2, 1fr); }
          .cta-section { padding: 48px 24px; margin: 0 16px; }
          h1 { font-size: 36px !important; }
        }
      `}</style>

      {/* ────── NAVBAR ────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: 64,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "#111827",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiShield size={15} color="#fff" />
          </div>
          <span
            style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}
          >
            PQC Storage
          </span>
        </div>

        {/* Nav links */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 32 }}
          className="hidden md:flex"
        >
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How it works
          </a>
          <a href="#security" className="nav-link">
            Security
          </a>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => router.push("/login")}
            className="btn-secondary"
            style={{ padding: "8px 16px" }}
          >
            Sign in
          </button>
          <button
            onClick={() => router.push("/register")}
            className="btn-primary"
            style={{ padding: "8px 16px" }}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ────── HERO ────── */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 80,
          textAlign: "center",
          maxWidth: 900,
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 28,
          }}
        ></div>

        <h1
          style={{
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#111827",
            marginBottom: 24,
          }}
        >
          Your files, encrypted
          <br />
          <span style={{ color: "#6b7280", fontWeight: 400 }}>
            before they leave your device.
          </span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#6b7280",
            maxWidth: 520,
            margin: "0 auto 40px",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          AES-256-GCM file encryption. ML-KEM key encapsulation. Built on the
          same NIST standards that will outlast quantum computers.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => router.push("/register")}
            className="btn-primary"
            style={{ padding: "14px 28px", fontSize: 15 }}
          >
            Start for free
            <FiArrowRight size={15} />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="btn-secondary"
            style={{ padding: "14px 28px", fontSize: 15 }}
          >
            Sign in to dashboard
          </button>
        </div>

        {/* Social proof micro-text */}
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 20 }}>
          No credit card required · Zero plaintext stored · Open source
        </p>

        {/* ── HERO MOCKUP ── */}
        <div
          className="hero-mockup"
          style={{ marginTop: 56, textAlign: "left" }}
        >
          {/* Browser chrome */}
          <div className="browser-bar">
            <div className="browser-dot" style={{ background: "#fca5a5" }} />
            <div className="browser-dot" style={{ background: "#fde68a" }} />
            <div className="browser-dot" style={{ background: "#86efac" }} />
            <div className="url-bar">app.pqcstorage.io/dashboard</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <FiLock size={11} color="#6b7280" />
              <span
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                Secure
              </span>
            </div>
          </div>

          {/* Dashboard layout */}
          <div style={{ display: "flex", minHeight: 340 }}>
            {/* Sidebar */}
            <div
              style={{
                width: 200,
                borderRight: "1px solid #f3f4f6",
                padding: "20px 12px",
                flexShrink: 0,
              }}
              className="hidden md:block"
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  padding: "0 8px",
                }}
              >
                Navigation
              </div>
              {[
                { label: "Dashboard", icon: "▪", active: true },
                { label: "My Files", icon: "▪", active: false },
                { label: "Upload", icon: "▪", active: false },
                { label: "Security", icon: "▪", active: false },
                { label: "Audit Log", icon: "▪", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: 13,
                    marginBottom: 2,
                    cursor: "default",
                    background: item.active ? "#111827" : "transparent",
                    color: item.active ? "#fff" : "#6b7280",
                    fontWeight: item.active ? 500 : 400,
                  }}
                >
                  <FiFile size={14} />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main */}
            <div style={{ flex: 1, padding: 24 }}>
              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {[
                  {
                    label: "Total files",
                    value: "24",
                    tag: "↑ 3 this week",
                    color: "#374151",
                  },
                  {
                    label: "Storage used",
                    value: "1.2 GB",
                    tag: "Unlimited",
                    color: "#374151",
                  },
                  {
                    label: "Security score",
                    value: "94",
                    tag: "/100 · Quantum-safe",
                    color: "#15803d",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "#f9fafb",
                      borderRadius: 10,
                      padding: "16px",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        marginBottom: 6,
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: s.color,
                        letterSpacing: "-0.02em",
                        fontFamily: "DM Mono, monospace",
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}
                    >
                      {s.tag}
                    </div>
                  </div>
                ))}
              </div>

              {/* File table */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #f0f0f0",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
                  >
                    Recent files
                  </span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    View all →
                  </span>
                </div>
                {[
                  {
                    name: "research_paper_final.pdf",
                    size: "2.4 MB",
                    enc: "ML-KEM + AES",
                    score: 94,
                  },
                  {
                    name: "patient_records_q4.xlsx",
                    size: "890 KB",
                    enc: "ML-KEM + AES",
                    score: 91,
                  },
                  {
                    name: "source_code_backup.zip",
                    size: "15.2 MB",
                    enc: "AES only",
                    score: 72,
                  },
                ].map((file) => (
                  <div key={file.name} className="file-row">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          background: "#f3f4f6",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FiFile size={14} color="#6b7280" />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#111827",
                            fontWeight: 500,
                          }}
                        >
                          {file.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>
                          {file.size}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        className={`encryption-chip${file.enc === "AES only" ? " muted" : ""}`}
                      >
                        {file.enc}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: file.score >= 90 ? "#15803d" : "#6b7280",
                          fontFamily: "DM Mono, monospace",
                          fontWeight: 600,
                        }}
                      >
                        {file.score}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── STAT BAR ────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        {[
          {
            num: "256",
            unit: "-bit",
            label:
              "Encryption key length — the same strength used by governments and banks",
            tag: "AES-GCM",
          },
          {
            num: "0",
            unit: "ms",
            label:
              "Time your plaintext spends on our servers — it never arrives unencrypted",
            tag: "Client-side only",
          },
          {
            num: "2",
            unit: "×",
            label:
              "Separate systems for your file and your key — a breach of one reveals nothing",
            tag: "Split storage",
          },
          {
            num: "Post-quantum",
            unit: "",
            label:
              "Key protection built for the era after quantum computers break RSA and ECC",
            tag: "NIST FIPS 203",
          },
        ].map((s, i, arr) => (
          <div
            key={s.tag}
            style={{
              padding: "36px 28px",
              borderRight: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: s.num === "Post-quantum" ? 28 : 38,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#111827",
                lineHeight: 1,
                fontFamily: "DM Mono, monospace",
              }}
            >
              {s.num}
              {s.unit && (
                <span style={{ fontSize: 22, color: "#9ca3af" }}>{s.unit}</span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
              {s.label}
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 11,
                fontWeight: 600,
                color: "#15803d",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                padding: "3px 8px",
                borderRadius: 5,
                alignSelf: "flex-start",
                marginTop: 2,
                fontFamily: "DM Mono, monospace",
              }}
            >
              {s.tag}
            </span>
          </div>
        ))}
      </div>

      {/* ────── FEATURES ────── */}
      <section
        id="features"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px" }}
      >
        <div style={{ marginBottom: 56 }}>
          <p className="section-label" style={{ marginBottom: 12 }}>
            Features
          </p>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#111827",
              maxWidth: 480,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Everything sensitive data demands
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#6b7280",
              maxWidth: 480,
              lineHeight: 1.6,
            }}
          >
            Built for developers, researchers, and organizations with long-term
            confidentiality requirements.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              icon: FiLock,
              title: "Hybrid encryption",
              desc: "AES-256-GCM encrypts your files. ML-KEM wraps the key. Fast symmetric encryption guarded by quantum-resistant key encapsulation.",
              tag: "AES + ML-KEM",
            },
            {
              icon: FiEye,
              title: "Zero plaintext storage",
              desc: "Files are encrypted before leaving your device. Cloudflare R2 only receives ciphertext. Even we cannot read your files.",
              tag: "Client-side only",
            },
            {
              icon: FiClock,
              title: "Self-destruct files",
              desc: "Set files to auto-delete after a time limit or download count. MongoDB TTL handles deletion automatically, server-side.",
              tag: "TTL + count limit",
            },
            {
              icon: FiKey,
              title: "Cryptographic audit trail",
              desc: "Every action logged with a SHA-256 chained audit trail. Each entry signs the previous one — tamper-evident by design.",
              tag: "SHA-256 chained",
            },
            {
              icon: FiShield,
              title: "Quantum security score",
              desc: "Every file gets a score based on encryption type, integrity hash, sharing status, and self-destruct settings. Know your risk at a glance.",
              tag: "0–100 scoring",
            },
            {
              icon: FiServer,
              title: "Tamper detection",
              desc: "AES-GCM authentication tag detects any modification to encrypted files. SHA-256 hash provides an additional integrity check.",
              tag: "GCM auth tag",
            },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#f9fafb",
                  border: "1px solid #f0f0f0",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <f.icon size={18} color="#374151" />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  {f.title}
                </h3>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#6b7280",
                    background: "#f3f4f6",
                    padding: "3px 8px",
                    borderRadius: 5,
                    whiteSpace: "nowrap",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {f.tag}
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ────── HOW IT WORKS ────── */}
      <section
        id="how-it-works"
        style={{
          background: "#fafafa",
          borderTop: "1px solid #f3f4f6",
          borderBottom: "1px solid #f3f4f6",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>
              Encryption pipeline
            </p>
            <h2
              style={{
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#111827",
                lineHeight: 1.15,
                marginBottom: 0,
              }}
            >
              4 steps. Zero trust required.
            </h2>
          </div>

          {/* Steps */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 0,
            }}
          >
            {[
              {
                num: "01",
                title: "You upload",
                desc: "Select any file. We accept any file type up to 100 MB. Nothing is transmitted yet.",
                icon: FiUpload,
              },
              {
                num: "02",
                title: "AES-256 encrypts",
                desc: "A fresh 256-bit key is generated. Your file is encrypted in-browser using AES-256-GCM with an auth tag.",
                icon: FiLock,
              },
              {
                num: "03",
                title: "ML-KEM wraps key",
                desc: "The AES key is encapsulated with ML-KEM. The raw key never touches the server.",
                icon: FiKey,
              },
              {
                num: "04",
                title: "Stored securely",
                desc: "The encrypted file and the wrapped key are stored separately. Even a full server compromise yields nothing readable.",
                icon: FiDatabase,
              },
            ].map((step, i) => (
              <div
                key={step.num}
                style={{
                  padding: "32px 28px",
                  borderRight: i < 3 ? "1px solid #e5e7eb" : "none",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#9ca3af",
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {step.num}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <step.icon size={16} color="#374151" />
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── SECURITY DEEP DIVE ────── */}
      <section
        id="security"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="security-grid"
        >
          <style>{`.security-grid { @media (max-width: 768px) { grid-template-columns: 1fr !important; } }`}</style>

          <div>
            <p className="section-label" style={{ marginBottom: 12 }}>
              Security standards
            </p>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#111827",
                lineHeight: 1.15,
                marginBottom: 20,
              }}
            >
              Only NIST standardized cryptography
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#6b7280",
                lineHeight: 1.7,
                marginBottom: 36,
              }}
            >
              We do not use experimental or unvetted algorithms. Every primitive
              in this stack has been standardized by NIST — the same body that
              standardized AES in 2001 and published ML-KEM in August 2024.
            </p>

            <div>
              {[
                {
                  algo: "AES-256-GCM",
                  std: "FIPS 197",
                  purpose: "File encryption",
                },
                {
                  algo: "ML-KEM-768",
                  std: "FIPS 203",
                  purpose: "Key encapsulation (PQC)",
                },
                {
                  algo: "SHA-256",
                  std: "FIPS 180-4",
                  purpose: "Integrity hashing",
                },
                {
                  algo: "bcrypt (cost 12)",
                  std: "RFC 2898",
                  purpose: "Password hashing",
                },
                {
                  algo: "JWT (RS256)",
                  std: "RFC 7519",
                  purpose: "Stateless authentication",
                },
              ].map((item) => (
                <div key={item.algo} className="check-item">
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <FiCheck size={11} color="#15803d" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          fontFamily: "DM Mono, monospace",
                        }}
                      >
                        {item.algo}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#9ca3af",
                          background: "#f3f4f6",
                          padding: "1px 7px",
                          borderRadius: 4,
                        }}
                      >
                        {item.std}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}
                    >
                      {item.purpose}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score card */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {/* File header + score ring */}
            <div
              style={{
                padding: "24px 24px 20px",
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiFile size={16} color="#6b7280" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111827",
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    research_paper_final.pdf
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                    2.4 MB · Uploaded just now
                  </div>
                </div>
              </div>
              {/* SVG ring */}
              <div
                style={{
                  position: "relative",
                  width: 64,
                  height: 64,
                  flexShrink: 0,
                }}
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="5"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="5"
                    strokeDasharray="163.4"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#111827",
                      fontFamily: "DM Mono, monospace",
                      lineHeight: 1,
                    }}
                  >
                    100
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "#9ca3af",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      marginTop: 1,
                    }}
                  >
                    SCORE
                  </span>
                </div>
              </div>
            </div>

            {/* Status badge */}

            {/* Check rows */}
            <div
              style={{
                padding: "4px 24px 24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {[
                {
                  icon: Cpu,
                  label: "ML-KEM post-quantum key wrapping",
                  pts: 40,
                  max: 40,
                  color: "#15803d",
                  bg: "#f0fdf4",
                  pips: 4,
                },
                {
                  icon: ShieldCheck,
                  label: "AES-GCM authentication tag",
                  pts: 20,
                  max: 20,
                  color: "#15803d",
                  bg: "#f0fdf4",
                  pips: 3,
                },
                {
                  icon: Fingerprint,
                  label: "SHA-256 integrity hash",
                  pts: 20,
                  max: 20,
                  color: "#1d4ed8",
                  bg: "#eff6ff",
                  pips: 3,
                },
                {
                  icon: TimerOff,
                  label: "Self-destruct timer configured",
                  pts: 10,
                  max: 10,
                  color: "#b45309",
                  bg: "#fffbeb",
                  pips: 2,
                },
                {
                  icon: EyeOff,
                  label: "Private — no public share link",
                  pts: 10,
                  max: 10,
                  color: "#b45309",
                  bg: "#fffbeb",
                  pips: 2,
                },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  style={{
                    padding: "13px 0",
                    borderBottom:
                      i < arr.length - 1 ? "1px solid #f9fafb" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: row.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <row.icon size={13} color={row.color} />
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: "#374151" }}>
                    {row.label}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div style={{ display: "flex", gap: 3 }}>
                      {[...Array(4)].map((_, j) => (
                        <div
                          key={j}
                          style={{
                            width: 18,
                            height: 4,
                            borderRadius: 2,
                            background: j < row.pips ? "#111827" : "#f3f4f6",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#111827",
                        fontFamily: "DM Mono, monospace",
                        minWidth: 20,
                      }}
                    >
                      {row.pts}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                margin: "0 24px 20px",
                paddingTop: 16,
                borderTop: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Total score
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#111827",
                      fontFamily: "DM Mono, monospace",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    100
                  </span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}> / 100</span>
                </div>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#111827",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "8px 14px",
                  borderRadius: 8,
                  letterSpacing: "0.02em",
                }}
              >
                <FiShield size={12} />
                Quantum-Safe
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── IMAGE PLACEHOLDER ────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto 120px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(249, 115, 22, 0.12)",
              color: "#f97316",
              border: "1px solid rgba(249, 115, 22, 0.2)",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Platform Overview
          </span>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Secure Cloud Storage for the Quantum Era
          </h2>

          <p
            style={{
              maxWidth: 700,
              margin: "0 auto",
              fontSize: 18,
              lineHeight: 1.7,
              color: "#6b7280",
            }}
          >
            PQC Cloud Storage combines modern cloud architecture with
            post-quantum cryptography, helping protect sensitive files against
            future quantum computing threats.
          </p>
        </div>

        <div
          style={{
            borderRadius: 28,
            overflow: "hidden",
            background: "#fff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
            height: 400, // adjust this
          }}
        >
          <img
            src="/pqc.png"
            alt="PQC Cloud Storage"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
            marginTop: 40,
          }}
        >
          {[
            {
              title: "AES-256",
              desc: "File Encryption",
            },
            {
              title: "ML-KEM",
              desc: "Quantum-Safe Key Exchange",
            },
            {
              title: "Zero-Knowledge",
              desc: "Privacy Focused",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                minWidth: 220,
                padding: "24px 32px",
                borderRadius: 20,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  fontSize: 15,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ────── CTA ────── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 96px" }}
      >
        <div className="cta-section">
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 16,
              maxWidth: 480,
              margin: "0 auto 16px",
            }}
          >
            Store files the right way
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#9ca3af",
              maxWidth: 400,
              margin: "0 auto 36px",
              lineHeight: 1.6,
            }}
          >
            No credit card required. Your files are encrypted before they ever
            leave your device.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => router.push("/register")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "#fff",
                color: "#111827",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Create your account
              <FiArrowRight size={15} />
            </button>
            <a
              href="https://github.com/ankit-prabhavak/pqc-cloud-storage"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "transparent",
                color: "#9ca3af",
                border: "1.5px solid rgba(255,255,255,0.15)",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <FiGithub size={15} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer
        style={{ borderTop: "1px solid #f3f4f6", padding: "64px 24px 40px" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
              gap: 48,
              marginBottom: 48,
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    background: "#111827",
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiShield size={14} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>
                  PQC Storage
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  marginBottom: 20,
                  maxWidth: 240,
                }}
              >
                Post-quantum secure cloud storage. Final year project built on
                NIST standardized cryptography.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  {
                    icon: FiGithub,
                    href: "https://github.com/ankit-prabhavak/pqc-cloud-storage",
                  },
                  { icon: FiTwitter, href: "#" },
                  { icon: FiLinkedin, href: "#" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                      transition: "border-color 0.15s, color 0.15s",
                    }}
                  >
                    <s.icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <div className="footer-heading">Product</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  "Dashboard",
                  "Upload files",
                  "Security score",
                  "Audit log",
                  "File sharing",
                ].map((item) => (
                  <a key={item} href="#">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Security */}
            <div>
              <div className="footer-heading">Security</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  "AES-256-GCM",
                  "ML-KEM (Kyber)",
                  "NIST FIPS 203",
                  "Tamper detection",
                  "Integrity hashing",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{ fontFamily: "DM Mono, monospace", fontSize: 13 }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Project */}
            <div>
              <div className="footer-heading">Project</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  "GitHub repo",
                  "Research paper",
                  "API docs",
                  "Contributing",
                  "License (MIT)",
                ].map((item) => (
                  <a key={item} href="#">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #f3f4f6",
              paddingTop: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "#9ca3af",
                fontFamily: "DM Mono, monospace",
              }}
            >
              © 2026 PQC Cloud Storage · Final Year Project
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {["AES-256-GCM", "ML-KEM FIPS 203", "Zero plaintext"].map(
                (label) => (
                  <span
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      color: "#9ca3af",
                    }}
                  >
                    <FiShield size={11} color="#6b7280" />
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
