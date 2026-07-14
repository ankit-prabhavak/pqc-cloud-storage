"use client";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
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
  FiThumbsDown,
  FiThumbsUp,
} from "react-icons/fi";
import { Cpu, ShieldCheck, Fingerprint, TimerOff, EyeOff } from "lucide-react";
import {
  // ...your existing icons
  FiGlobe,
  FiChevronDown,
  FiArrowUp,
  FiMail,
} from "react-icons/fi";
import { TbCloudComputing, TbCloudLock } from "react-icons/tb";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.05,
      wheelMultiplier: 0.5,
    });

    const handleScroll = (e: any) => {
      console.log(e);
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
      lenis.destroy();
    };
  }, []);

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

      <style>{`
  .feature-card {
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    padding: 32px;
    background: #fff;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  }
  .feature-card:hover {
    border-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow:
      0 8px 24px rgba(94, 234, 212, 0.16),
      0 8px 24px rgba(56, 189, 248, 0.16),
      0 8px 24px rgba(99, 102, 241, 0.16),
      0 4px 12px rgba(0, 0, 0, 0.06);
  }
@keyframes floatBlue {
  from { transform: translate(-120px, -60px) scale(1); }
  to   { transform: translate(120px, 50px) scale(1.15); }
}

@keyframes floatCyan {
  from { transform: translate(80px, 40px) scale(1.05); }
  to   { transform: translate(-100px, -50px) scale(0.95); }
}

@keyframes floatPurple {
  from { transform: translate(-80px, 60px) scale(1); }
  to   { transform: translate(110px, -60px) scale(1.12); }
}

@keyframes floatGreen {
  from { transform: translate(0px, 40px) scale(1); }
  to   { transform: translate(80px, -50px) scale(1.08); }
}

.aurora-blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(130px);
  opacity: 0.85;
  will-change: transform, filter;
  animation:
    floatBlue 12s ease-in-out infinite alternate,
    hueShift 20s linear infinite;
}
    @keyframes hueShift {
  0% {
    filter: blur(130px) hue-rotate(0deg) saturate(1);
  }
  25% {
    filter: blur(130px) hue-rotate(20deg) saturate(1.2);
  }
  50% {
    filter: blur(130px) hue-rotate(45deg) saturate(1.4);
  }
  75% {
    filter: blur(130px) hue-rotate(20deg) saturate(1.2);
  }
  100% {
    filter: blur(130px) hue-rotate(0deg) saturate(1);
  }
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
              width: 28,
              height: 28,
              background: "#111827",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TbCloudComputing size={20} color="#fff" />
          </div>
          <span
            style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-0.01em" }}
          >
            X0RS
          </span>
        </div>

        {/* Nav links */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 32 }}
          className="hidden md:flex"
        > 
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How it works
          </a>
          <a href="#security" className="nav-link">
            Security
          </a>
          <a href="#use-cases" className="nav-link">
            Applications
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
      <div
        style={{ position: "relative", overflow: "hidden", background: "#fff" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            height: "60%",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 0,
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          }}
        >
          {/* Blue */}
          <div
            className="aurora-blob"
            style={{
              width: 700,
              height: 700,
              left: "28%",
              top: "-340px",
              background: "rgba(37,99,235,0.60)", // #2563EB
              animation: "floatBlue 10s ease-in-out infinite alternate",
            }}
          />

          {/* Cyan */}
          <div
            className="aurora-blob"
            style={{
              width: 550,
              height: 550,
              left: "-120px",
              top: "-180px",
              background: "rgba(8,145,178,0.50)", // #0891B2
              animation: "floatCyan 14s ease-in-out infinite alternate",
            }}
          />

          {/* Purple */}
          <div
            className="aurora-blob"
            style={{
              width: 600,
              height: 600,
              right: "-120px",
              top: "-180px",
              background: "rgba(109,40,217,0.55)",
              animation: "floatPurple 18s ease-in-out infinite alternate",
            }}
          />

          {/* Emerald */}
          <div
            className="aurora-blob"
            style={{
              width: 450,
              height: 450,
              left: "50%",
              top: "80px",
              background: "rgba(5,150,105,0.22)",
              animation: "floatGreen 22s ease-in-out infinite alternate",
            }}
          />
          <div
            className="aurora-blob"
            style={{
              width: 450,
              height: 450,
              left: "60%",
              top: "-120px",
              background: "rgba(251,146,60,.28)",
              animation:
                "floatOrange 16s ease-in-out infinite alternate, pulseBlue 6s ease-in-out infinite",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.004,
            backgroundImage: `
      linear-gradient(rgba(15,23,42,.018) 0.5px, transparent 0.5px),
      linear-gradient(90deg, rgba(15,23,42,.018) 0.5px, transparent 0.5px)
    `,
            backgroundSize: "72px 72px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.85) 75%, white 100%)",
            pointerEvents: "none",
          }}
        />

        <section className="relative z-10 w-full px-24 md:px-30 pt-50 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-[1600px] mx-auto">
            {/* Left: Text content */}
            <div className="text-left lg:text-left max-w-lg mx-auto lg:mx-0">
              <h1 className="text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-gray-900 mb-6">
                Your files, encrypted
                <br />
                <span className="text-gray-500 font-normal">
                  before they leave your device.
                </span>
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
                AES-256-GCM file encryption. ML-KEM key encapsulation. Built on
                the same NIST standards that will outlast quantum computers.
              </p>

              <div className="flex items-center gap-3 flex-wrap mb-5">
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

              <p className="text-sm text-gray-400">
                No credit card required · Zero plaintext stored · Open source
              </p>
            </div>

            {/* Right: Hero mockup */}
            <div className="hero-mockup">
              {/* Browser chrome */}
              <div className="browser-bar">
                <div
                  className="browser-dot"
                  style={{ background: "#fca5a5" }}
                />
                <div
                  className="browser-dot"
                  style={{ background: "#fde68a" }}
                />
                <div
                  className="browser-dot"
                  style={{ background: "#86efac" }}
                />
                <div className="url-bar">app.pqcstorage.io/dashboard</div>
                <div className="flex items-center gap-1">
                  <FiLock size={11} color="#6b7280" />
                  <span className="text-[11px] text-gray-500 font-mono">
                    Secure
                  </span>
                </div>
              </div>

              {/* Dashboard layout */}
              <div className="flex min-h-[340px]">
                {/* Sidebar */}
                <div className="hidden md:block w-[200px] border-r border-gray-100 py-5 px-3 flex-shrink-0">
                  <div className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase mb-3 px-2">
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
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] mb-0.5 cursor-default ${
                        item.active
                          ? "bg-gray-900 text-white font-medium"
                          : "text-gray-500 font-normal"
                      }`}
                    >
                      <FiFile size={14} />
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="flex-1 p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      {
                        label: "Total files",
                        value: "24",
                        tag: "↑ 3 this week",
                        color: "text-gray-700",
                      },
                      {
                        label: "Storage used",
                        value: "1.2 GB",
                        tag: "Unlimited",
                        color: "text-gray-700",
                      },
                      {
                        label: "Security score",
                        value: "94",
                        tag: "/100 · Quantum-safe",
                        color: "text-green-700",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-gray-50 rounded-[10px] p-4 border border-gray-100"
                      >
                        <div className="text-[11px] text-gray-400 mb-1.5 font-medium">
                          {s.label}
                        </div>
                        <div
                          className={`text-[22px] font-bold tracking-tight font-mono ${s.color}`}
                        >
                          {s.value}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {s.tag}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* File table */}
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                      <span className="text-[13px] font-semibold text-gray-700">
                        Recent files
                      </span>
                      <span className="text-xs text-gray-500">View all →</span>
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
                        <div className="flex items-center gap-3">
                          <div className="w-[34px] h-[34px] bg-gray-100 rounded-lg flex items-center justify-center">
                            <FiFile size={14} color="#6b7280" />
                          </div>
                          <div>
                            <div className="text-[13px] text-gray-900 font-medium">
                              {file.name}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {file.size}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`encryption-chip${
                              file.enc === "AES only" ? " muted" : ""
                            }`}
                          >
                            {file.enc}
                          </span>
                          <span
                            className={`text-xs font-mono font-semibold ${
                              file.score >= 90
                                ? "text-green-700"
                                : "text-gray-500"
                            }`}
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
          </div>
        </section>
      </div>

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

      {/* ────── USE CASES / INDUSTRIES ────── */}
      <section id="use-cases" className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
            Use cases
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 max-w-xl leading-tight mb-4">
            Built for data that can't be compromised
          </h2>
          <p className="text-base text-gray-500 max-w-xl leading-relaxed">
            Wherever confidentiality has to outlast the next decade of
            computing, PQC Cloud Storage fits in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Financial Records",
              desc: "Store statements, audits, and transaction logs with hybrid AES + ML-KEM encryption built to government-grade standards.",
              gradient:
                "https://plus.unsplash.com/premium_photo-1679923813998-6603ee2466c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmluYW5jZXxlbnwwfHwwfHx8MA%3D%3D",
            },
            {
              title: "Healthcare & Research",
              desc: "Protect patient records and clinical research data with encryption designed to stay secure through the quantum transition.",
              gradient:
                "https://images.unsplash.com/photo-1543333995-a78aea2eee50?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGhlYWx0aGNhcmV8ZW58MHx8MHx8fDA%3D",
            },
            {
              title: "Legal & Compliance",
              desc: "Keep case files, contracts, and privileged communications sealed with a tamper-evident, chained audit trail.",
              gradient:
                "https://plus.unsplash.com/premium_photo-1695449439526-9cebdbfa1a2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGVnYWwlMjBhbmQlMjBjb21wbGlhbmNlfGVufDB8fDB8fHww",
            },
            {
              title: "Academic & R&D",
              desc: "Share unpublished research and datasets with collaborators without exposing raw files to any third party, ever.",
              gradient:
                "https://plus.unsplash.com/premium_photo-1661374880675-0c79f7b1dad5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWNhZGVtaWMlMjBhbmQlMjByZXNlYXJjaHxlbnwwfHwwfHx8MA%3D%3D",
            },
            {
              title: "Government & Defense",
              desc: "Meet long-term confidentiality mandates with NIST FIPS 203 post-quantum key encapsulation, not experimental crypto.",
              gradient:
                "https://images.unsplash.com/photo-1760872646618-13594fc00567?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdvdmVybm1lbnQlMjBhbmQlMjBkZWZlbmNlfGVufDB8fDB8fHww",
            },
            {
              title: "Enterprise IT",
              desc: "Give engineering and ops teams a zero-trust drop-in for secrets, backups, and source archives with self-destruct controls.",
              gradient:
                "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEVudGVycHJpc2UlMjBpdHxlbnwwfHwwfHx8MA%3D%3D",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group"
            >
              <div
                className="h-44 w-full transition-transform duration-500 ease-out group-hover:scale-105"
                // style={{ background: item.gradient }}
              >
                <img
                  src={item.gradient}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {item.desc}
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-gray-900">
                  <span className="max-w-0 group-hover:max-w-[100px] overflow-hidden whitespace-nowrap transition-all duration-300 ease-out group-hover:mr-2">
                    View more
                  </span>
                  <FiArrowRight
                    size={16}
                    className="text-gray-900 group-hover:translate-x-1 transition-transform duration-200"
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────── FEEDBACK BANNER ────── */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div
          className="rounded-[28px] px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{
            background:
              "linear-gradient(90deg, #5eead4 0%, #38bdf8 35%, #6366f1 70%, #8b5cf6 100%)",
          }}
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Did you find what you were looking for today?
            </h3>
            <p className="text-gray-800/80 text-base">
              Let us know so we can improve the quality of the content on our
              pages
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-800 transition-colors duration-200">
              Yes
              <FiThumbsUp size={15} />
            </button>
            <button className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-800 transition-colors duration-200">
              No
              <FiThumbsDown size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="relative bg-[#0f1420] rounded-t-[60px] pt-24 pb-8 px-6 md:px-10 mt-24">
        {/* Top row: Brand | Links | Newsletter */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 max-w-7xl mx-auto mb-8 pb-8 ">
          {/* Left: Logo + name + description */}
          <div className="max-w-[220px] flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                <TbCloudComputing size={20} className="text-gray-900" />
              </div>
              <span className="text-white font-bold text-[20px] tracking-tight">
                XORS
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Post-quantum secure cloud storage built on NIST standardized
              cryptography.
            </p>
          </div>

          {/* Middle: Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1 lg:mx-4">
            {[
              {
                heading: "Product",
                links: [
                  "Dashboard",
                  "Upload Files",
                  "Security Score",
                  "Audit Log",
                ],
              },
              {
                heading: "Security",
                links: [
                  "AES-256-GCM",
                  "ML-KEM (Kyber)",
                  "NIST FIPS 203",
                  "Tamper Detection",
                ],
              },
              {
                heading: "Project",
                links: [
                  "GitHub Repo",
                  "Documentation",
                  "Contributing",
                  "License (MIT)",
                ],
              },
              {
                heading: "Help",
                links: ["Contact Us", "FAQs", "Report an Issue"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-white text-sm font-bold mb-4">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 text-sm hover:text-white hover:underline underline-offset-4 transition-colors duration-150"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right: Newsletter */}
          <div className="w-full lg:w-auto lg:min-w-[260px] flex-shrink-0">
            <h4 className="text-white text-sm font-bold mb-3">Stay updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get notified about new features and security updates.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full bg-white/5 border border-gray-600 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-150"
              />
              <button
                type="submit"
                className="bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200 w-full"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Back to top */}
        <div className="flex justify-center mb-10">
          <a
            href="#top"
            className="flex items-center gap-2 text-white text-sm font-semibold hover:underline underline-offset-4 transition-all duration-150"
          >
            Back to top
            <FiArrowUp size={14} />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/60 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="#"
              className="hover:text-white hover:underline underline-offset-4 transition-colors duration-150"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-white hover:underline underline-offset-4 transition-colors duration-150"
            >
              Site Terms
            </a>
            <span className="text-gray-500">
              © 2026 PQC Cloud Storage. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-150"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
