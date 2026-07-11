"use client";
import Lenis from 'lenis';
import { useEffect } from 'react';
import 'lenis/dist/lenis.css'
import { useRouter } from "next/navigation";
import {
  FiShield,
  FiLock,
  FiGithub,
  FiArrowRight,
  FiFile,
  FiChevronRight,
} from "react-icons/fi";
import Image from "next/image";
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import {
  FeaturesSkeleton,
  PipelineSkeleton,
  SecuritySkeleton,
  FooterSkeleton,
} from '@/components/landing/Skeletons';

// Lazy load below-the-fold sections
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
  loading: () => <FeaturesSkeleton />,
  ssr: false,
});
const PipelineSection = dynamic(() => import('@/components/landing/PipelineSection'), {
  loading: () => <PipelineSkeleton />,
  ssr: false,
});
const SecuritySection = dynamic(() => import('@/components/landing/SecuritySection'), {
  loading: () => <SecuritySkeleton />,
  ssr: false,
});
const FooterSection = dynamic(() => import('@/components/landing/FooterSection'), {
  loading: () => <FooterSkeleton />,
  ssr: false,
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-bg text-text overflow-x-hidden relative z-0">
      <style>{`
        * { box-sizing: border-box; }
        .mono { font-family: var(--font-mono), monospace; }
        .badge-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
        }
        .nav-link { font-size: 14px; color: var(--text-muted); text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: var(--text); }
        
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; background: var(--burgundy); color: var(--text);
          border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
          background: var(--burgundy-bright);
          box-shadow: 0 0 20px rgba(156, 47, 68, 0.45);
        }
        .btn-primary:active { transform: scale(0.98); }
        
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; background: transparent; color: var(--text);
          border: 1.5px solid var(--border); border-radius: 10px; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: border-color 0.15s, color 0.15s;
        }
        .btn-secondary:hover { border-color: var(--burgundy); color: var(--text); }
        
        .hero-mockup {
          background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
          box-shadow: 0 20px 80px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .browser-bar {
          display: flex; align-items: center; gap: 6px; padding: 12px 16px;
          background: var(--surface-raised); border-bottom: 1px solid var(--border);
        }
        .browser-dot { width: 10px; height: 10px; border-radius: 50%; }
        .url-bar {
          flex: 1; margin: 0 12px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 6px; padding: 4px 12px; font-size: 11px; color: var(--text-muted);
          font-family: var(--font-mono), monospace;
        }
        .file-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; border-bottom: 1px solid var(--border);
          transition: background 0.1s;
        }
        .file-row:hover { background: var(--surface-raised); }
        .file-row:last-child { border-bottom: none; }
        .encryption-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 5px; font-size: 10px;
          font-weight: 600; font-family: var(--font-mono), monospace;
          background: rgba(122, 31, 49, 0.2); color: var(--text);
          border: 1px solid rgba(156, 47, 68, 0.3);
        }
        .encryption-chip.muted {
          background: var(--surface-raised); color: var(--text-muted);
          border-color: var(--border);
        }
        .cta-section {
          background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 72px 48px;
          text-align: center; margin: 0 24px;
        }
        @media (max-width: 768px) {
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
          background: "rgba(11,10,12,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--burgundy)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiShield size={15} color="#fff" />
          </div>
          <span
            style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", fontFamily: "var(--font-display)" }}
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
          paddingTop: 160,
          paddingBottom: 80,
          textAlign: "center",
          maxWidth: 900,
          margin: "0 auto",
          padding: "160px 24px 80px",
          position: "relative",
        }}
      >
        {/* Hero Background Glow Orbs & Lattice */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] md:w-[35vw] md:h-[35vw] rounded-full bg-[radial-gradient(circle,rgba(122,31,49,0.15)_0%,transparent_70%)] blur-3xl animate-drift-1" />
          <div className="absolute top-[35%] right-[10%] w-[55vw] h-[55vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(156,47,68,0.1)_0%,transparent_70%)] blur-3xl animate-drift-2" />
          <div className="absolute top-[5%] left-[45%] w-[45vw] h-[45vw] md:w-[30vw] md:h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(61,19,28,0.25)_0%,transparent_70%)] blur-3xl animate-drift-3" />

          <svg className="absolute inset-0 w-full h-full opacity-[0.04] stroke-[#F5F1EE]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cryptolattice" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" strokeWidth="1" />
                <circle cx="0" cy="0" r="2" fill="currentColor" />
                <circle cx="80" cy="0" r="2" fill="currentColor" />
                <circle cx="0" cy="80" r="2" fill="currentColor" />
                <circle cx="80" cy="80" r="2" fill="currentColor" />
                <path d="M 0 0 L 80 80" fill="none" strokeWidth="0.5" strokeDasharray="3 3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cryptolattice)" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            fontFamily: "var(--font-display)",
            marginBottom: 24,
          }}
        >
          Your files, encrypted
          <br />
          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
            before they leave your device.
          </span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--text-muted)",
            maxWidth: 520,
            margin: "0 auto 40px",
            lineHeight: 1.6,
            fontWeight: 400,
            fontFamily: "var(--font-body)",
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

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 20 }}>
          No credit card required · Zero plaintext stored · Open source
        </p>

        {/* ── HERO MOCKUP ── */}
        <div
          className="hero-mockup"
          style={{ marginTop: 56, textAlign: "left" }}
        >
          {/* Browser chrome */}
          <div className="browser-bar">
            <div className="browser-dot" style={{ background: "#7A1F31" }} />
            <div className="browser-dot" style={{ background: "#3D131C" }} />
            <div className="browser-dot" style={{ background: "#2A2224" }} />
            <div className="url-bar">app.pqcstorage.io/dashboard</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <FiLock size={11} className="text-text-muted" />
              <span
                className="font-mono text-xs text-text-muted"
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
                borderRight: "1px solid var(--border)",
                padding: "20px 12px",
                flexShrink: 0,
              }}
              className="hidden md:block"
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
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
                { label: "Dashboard", active: true },
                { label: "My Files", active: false },
                { label: "Upload", active: false },
                { label: "Security", active: false },
                { label: "Audit Log", active: false },
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
                    background: item.active ? "var(--burgundy)" : "transparent",
                    color: item.active ? "var(--text)" : "var(--text-muted)",
                    fontWeight: item.active ? 500 : 400,
                  }}
                >
                  <FiFile size={14} />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main */}
            <div style={{ flex: 1, padding: 24 }} className="bg-surface">
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
                    color: "var(--text)",
                  },
                  {
                    label: "Storage used",
                    value: "1.2 GB",
                    tag: "Unlimited",
                    color: "var(--text)",
                  },
                  {
                    label: "Security score",
                    value: "94",
                    tag: "/100 · Quantum-safe",
                    color: "#4ade80",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "var(--surface-raised)",
                      borderRadius: 10,
                      padding: "16px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
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
                        fontFamily: "var(--font-mono), monospace",
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
                    >
                      {s.tag}
                    </div>
                  </div>
                ))}
              </div>

              {/* File table */}
              <div
                style={{
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}
                  >
                    Recent files
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
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
                          background: "var(--surface)",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FiFile size={14} className="text-text-muted" />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--text)",
                            fontWeight: 500,
                          }}
                        >
                          {file.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
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
                          color: file.score >= 90 ? "#4ade80" : "var(--text-muted)",
                          fontFamily: "var(--font-mono), monospace",
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
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 border-t border-b border-border bg-surface"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {[
          {
            num: "256",
            unit: "-bit",
            label: "Encryption key length — the same strength used by governments and banks",
            tag: "AES-GCM",
          },
          {
            num: "0",
            unit: "ms",
            label: "Time your plaintext spends on our servers — it never arrives unencrypted",
            tag: "Client-side only",
          },
          {
            num: "2",
            unit: "×",
            label: "Separate systems for your file and your key — a breach of one reveals nothing",
            tag: "Split storage",
          },
          {
            num: "Post-quantum",
            unit: "",
            label: "Key protection built for the era after quantum computers break RSA and ECC",
            tag: "NIST FIPS 203",
          },
        ].map((s) => (
          <motion.div
            key={s.tag}
            variants={cardVariants}
            className="p-9 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-border last:border-r-0 hover:bg-surface-raised transition-colors group cursor-default"
          >
            <div
              className="text-4xl font-bold tracking-tight text-text leading-none font-mono"
              style={{ fontSize: s.num === "Post-quantum" ? '24px' : '38px' }}
            >
              {s.num}
              {s.unit && (
                <span className="text-xl text-text-muted">{s.unit}</span>
              )}
            </div>
            <div className="text-xs text-text-muted leading-relaxed font-body">
              {s.label}
            </div>
            <span
              className="inline-flex items-center text-[10px] font-semibold text-burgundy-bright bg-burgundy-dim/40 border border-burgundy-bright/20 px-2 py-0.5 rounded self-start mt-2 font-mono group-hover:border-burgundy-bright group-hover:bg-burgundy-dim transition-all"
            >
              {s.tag}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ────── FEATURES ────── */}
      <FeaturesSection />

      {/* ────── HOW IT WORKS ────── */}
      <PipelineSection />

      {/* ────── SECURITY DEEP DIVE ────── */}
      <SecuritySection />

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
              background: "rgba(122, 31, 49, 0.15)",
              color: "var(--burgundy-bright)",
              border: "1px solid rgba(156, 47, 68, 0.2)",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            Platform Overview
          </span>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: 16,
              fontFamily: "var(--font-display)",
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
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            PQC Cloud Storage combines modern cloud architecture with post-quantum cryptography, helping protect sensitive files against future quantum computing threats.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            height: 400,
          }}
        >
          <Image
            src="/pqc.png"
            alt="PQC Cloud Storage"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1200px) 100vw, 1200px"
            loading="lazy"
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
              className="card-premium"
              style={{
                minWidth: 220,
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: 8,
                  fontFamily: "var(--font-display)",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 15,
                  margin: 0,
                  fontFamily: "var(--font-body)",
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
              color: "var(--text)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 16,
              maxWidth: 480,
              margin: "0 auto 16px",
              fontFamily: "var(--font-display)",
            }}
          >
            Store files the right way
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-muted)",
              maxWidth: 400,
              margin: "0 auto 36px",
              lineHeight: 1.6,
              fontFamily: "var(--font-body)",
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
              className="btn-primary"
              style={{ padding: "14px 28px", fontSize: 15 }}
            >
              Create your account
              <FiArrowRight size={15} />
            </button>
            <a
              href="https://github.com/ankit-prabhavak/pqc-cloud-storage"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: "14px 28px", fontSize: 15, textDecoration: "none" }}
            >
              <FiGithub size={15} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <FooterSection />
    </main>
  );
}
