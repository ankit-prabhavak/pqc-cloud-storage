"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiShield,
  FiLock,
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
  FiMail,
  FiArrowUp,
} from "react-icons/fi";
import { Cpu, ShieldCheck, Fingerprint, TimerOff, EyeOff } from "lucide-react";
import { TbCloudComputing } from "react-icons/tb";

const socialLinks = [
  {
    icon: FiGithub,
    href: "https://github.com/ankit-prabhavak/pqc-cloud-storage/",
    label: "GitHub",
  },
  {
    icon: FiLinkedin,
    href: "#",
    label: "LinkedIn",
  },
  {
    icon: FiMail,
    href: "mailto:team@xors.in",
    label: "Email",
  },
  {
    icon: FiTwitter,
    href: "#",
    label: "X",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "Ankit Kumar",
    image: "/team/ankit.png",
    role: "Backend & Security",
    description:
      "Built secure backend services, authentication and post-quantum cryptography integration.",
    profile: "https://linkedin.com/in/ankit-prabhavak",
  },
  {
    id: 2,
    name: "Abhijit Giri",
    image: "/team/abhijit.jpeg",
    role: "Frontend Engineer",
    description:
      "Designed responsive UI, dashboard and overall user experience.",
    profile: "https://www.linkedin.com/in/jeetabhig/",
  },
  {
    id: 3,
    name: "Abhinav Mishra",
    image: "/team/abhinav.png",
    role: "Backend Engineer",
    description: "Developed REST APIs, storage services and cloud integration.",
    profile: "https://www.linkedin.com/in/abhinav-mishra-252234329",
  },
  {
    id: 4,
    name: "Anmol Gupta",
    image: "/team/anmol.jpeg",
    role: "Research & Testing",
    description: "Worked on cryptography research, testing and validation.",
    profile: "https://www.linkedin.com/in/anmol-gupta-714933308/",
  },
  {
    id: 5,
    name: "Kavya Chaturvedi",
    image: "/team/kavya.jpeg",
    role: "Cloud Engineer",
    description:
      "Worked on cloud deployment, storage integration and infrastructure.",
    profile: "https://www.linkedin.com/in/kavyachaturvedi58",
  },
  {
    id: 6,
    name: "Devashish Tripathi",
    image: "/team/deva.jpeg",
    role: "QA & Documentation",
    description:
      "Handled testing, documentation and quality assurance throughout development.",
    profile: "https://www.linkedin.com/in/devashish-tripathi-046b022a6",
  },
];

const footerSections = [
  {
    heading: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Upload Files", href: "/dashboard/upload" },
      { label: "Security Score", href: "/dashboard" },
      { label: "Audit Log", href: "/dashboard/audit" },
    ],
  },
  {
    heading: "Security",
    links: [
      { label: "AES-256-GCM", href: "#security" },
      { label: "ML-KEM (Kyber)", href: "#security" },
      { label: "NIST FIPS 203", href: "#security" },
      { label: "Tamper Detection", href: "#security" },
    ],
  },
  {
    heading: "Project",
    links: [
      {
        label: "GitHub Repo",
        href: "https://github.com/ankit-prabhavak/pqc-cloud-storage",
      },
      {
        label: "Documentation",
        href: "https://github.com/ankit-prabhavak/pqc-cloud-storage/wiki",
      },
      {
        label: "Contributing",
        href: "https://github.com/ankit-prabhavak/pqc-cloud-storage/blob/main/CONTRIBUTING.md",
      },
      {
        label: "License (MIT)",
        href: "https://github.com/ankit-prabhavak/pqc-cloud-storage/blob/main/LICENSE",
      },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "#faq" },
      {
        label: "Report an Issue",
        href: "https://github.com/ankit-prabhavak/pqc-cloud-storage/issues",
      },
    ],
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.2,
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
      id="top"
      className="min-h-screen overflow-x-hidden bg-white text-gray-900"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .mono { font-family: 'DM Mono', monospace; }
        .hero-mockup {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          box-shadow: 0 20px 80px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .browser-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .browser-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .url-bar {
          flex: 1;
          margin: 0 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 11px;
          color: #9ca3af;
          font-family: 'DM Mono', monospace;
        }
        .aurora-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(130px);
          opacity: 0.85;
          will-change: transform, filter;
          animation: floatBlue 12s ease-in-out infinite alternate, hueShift 20s linear infinite;
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
        @keyframes hueShift {
          0% { filter: blur(130px) hue-rotate(0deg) saturate(1); }
          25% { filter: blur(130px) hue-rotate(20deg) saturate(1.2); }
          50% { filter: blur(130px) hue-rotate(45deg) saturate(1.4); }
          75% { filter: blur(130px) hue-rotate(20deg) saturate(1.2); }
          100% { filter: blur(130px) hue-rotate(0deg) saturate(1); }
        }
        .feature-card {
          border: 1px solid #f0f0f0;
          border-radius: 16px;
          padding: 32px;
          background: #fff;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 24px rgba(94, 234, 212, 0.16),
            0 8px 24px rgba(56, 189, 248, 0.16),
            0 8px 24px rgba(99, 102, 241, 0.16),
            0 4px 12px rgba(0, 0, 0, 0.06);
        }
        .team-section {
          max-width: 1300px;
          margin: 140px auto;
          padding: 0 24px;
        }
        .team-card {
          position: relative;
          padding: 38px;
          border-radius: 28px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(59, 130, 246, 0.08);
          box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06);
          transition: 0.45s ease;
          opacity: 0;
          animation: cardEnter 0.9s forwards;
        }
        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(80px) rotate(var(--r, -8deg));
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(inherit);
          }
        }
      `}</style>

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-900">
              <TbCloudComputing size={18} color="#fff" />
            </div>
            <span className="text-xl font-bold tracking-tight">X0RS</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="/"
              className="text-sm text-gray-500 transition hover:text-gray-900"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm text-gray-500 transition hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-gray-500 transition hover:text-gray-900"
            >
              How it works
            </a>
            <a
              href="#security"
              className="text-sm text-gray-500 transition hover:text-gray-900"
            >
              Security
            </a>
            <a
              href="#use-cases"
              className="text-sm text-gray-500 transition hover:text-gray-900"
            >
              Applications
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => router.push("/login")}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push("/register")}
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 hover:cursor-pointer"
              >
                Get started
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-2 md:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white shadow-md md:hidden">
            <div className="flex flex-col gap-2 px-4 py-3">
              <a href="/" className="py-2 text-gray-700">
                Home
              </a>
              <a href="#features" className="py-2 text-gray-700">
                Features
              </a>
              <a href="#how-it-works" className="py-2 text-gray-700">
                How it works
              </a>
              <a href="#security" className="py-2 text-gray-700">
                Security
              </a>
              <a href="#use-cases" className="py-2 text-gray-700">
                Applications
              </a>

              <div className="flex gap-2 border-t border-gray-100 pt-2">
                <button
                  onClick={() => router.push("/login")}
                  className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-gray-300 hover:cursor-pointer"
                >
                  Sign in
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="flex-1 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 hover:cursor-pointer"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="relative overflow-hidden bg-white pt-20">
        <div
          className="pointer-events-none absolute inset-0 z-0 h-[60%]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          }}
        >
          <div
            className="aurora-blob"
            style={{
              width: 700,
              height: 700,
              left: "28%",
              top: -340,
              background: "rgba(37,99,235,0.60)",
              animation: "floatBlue 10s ease-in-out infinite alternate",
            }}
          />
          <div
            className="aurora-blob"
            style={{
              width: 550,
              height: 550,
              left: -120,
              top: -180,
              background: "rgba(8,145,178,0.50)",
              animation: "floatCyan 14s ease-in-out infinite alternate",
            }}
          />
          <div
            className="aurora-blob"
            style={{
              width: 600,
              height: 600,
              right: -120,
              top: -180,
              background: "rgba(109,40,217,0.55)",
              animation: "floatPurple 18s ease-in-out infinite alternate",
            }}
          />
          <div
            className="aurora-blob"
            style={{
              width: 450,
              height: 450,
              left: "50%",
              top: 80,
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
              top: -120,
              background: "rgba(251,146,60,0.28)",
              animation:
                "floatOrange 16s ease-in-out infinite alternate, pulseBlue 6s ease-in-out infinite",
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,.018) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(15,23,42,.018) 0.5px, transparent 0.5px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.85) 75%, white 100%)",
          }}
        />

        <section className="relative z-10 w-full px-8 py-12 sm:px-12 lg:px-20 xl:px-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="mx-auto max-w-lg text-left lg:mx-0">
              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Security that starts
                <br />
                <span className="font-normal text-gray-500">
                  before your files leave your device.
                </span>
              </h1>

              <p className="mb-6 max-w-lg text-lg leading-relaxed text-gray-500">
                XORS combines zero-knowledge architecture, client-side
                encryption, and post-quantum cryptography to keep your data
                private today and resilient against tomorrow's threats.
              </p>

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => router.push("/register")}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800"
                >
                  Start for free
                  <FiArrowRight size={15} />
                </button>

                <button
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50"
                >
                  Sign in to dashboard
                </button>
              </div>

              <p className="text-sm text-gray-400">
                No credit card required · Zero plaintext stored · Open source
              </p>
            </div>

            <div className="hero-mockup w-full">
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
                  <FiLock size={12} color="#6b7280" />
                  <span className="text-[11px] font-mono text-gray-500">
                    Secure
                  </span>
                </div>
              </div>

              <div className="flex min-h-[320px] flex-col md:flex-row">
                <div className="hidden flex-shrink-0 border-r border-gray-100 px-3 py-5 md:block md:w-48">
                  <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
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
                      className={`mb-1.5 flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${
                        item.active
                          ? "bg-gray-900 font-medium text-white"
                          : "text-gray-500"
                      }`}
                    >
                      <FiFile size={14} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex-1 p-4 md:p-6">
                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                        className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="mb-1.5 text-[11px] font-medium text-gray-400">
                          {s.label}
                        </div>
                        <div
                          className={`mono text-[22px] font-bold tracking-tight ${s.color}`}
                        >
                          {s.value}
                        </div>
                        <div className="mt-0.5 text-[11px] text-gray-400">
                          {s.tag}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
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
                      <div
                        key={file.name}
                        className="flex flex-col justify-between gap-3 border-b border-gray-100 p-3 transition last:border-b-0 hover:bg-gray-50 sm:flex-row sm:items-center sm:p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                            <FiFile size={14} color="#6b7280" />
                          </div>

                          <div>
                            <div className="text-[13px] font-medium text-gray-900">
                              {file.name}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {file.size}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2.5 sm:mt-0">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-xs font-semibold ${
                              file.enc === "AES only"
                                ? "bg-gray-50 text-gray-400"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {file.enc}
                          </span>

                          <span
                            className={`font-mono text-xs font-semibold ${
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

      <div className="grid grid-cols-1 divide-y divide-gray-100 border-t border-b border-gray-100 bg-white sm:grid-cols-2 lg:grid-cols-4 sm:divide-y-0 sm:divide-x">
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
        ].map((s) => (
          <div key={s.tag} className="flex flex-col gap-2 p-6">
            <div className="mono flex items-baseline gap-2 text-2xl font-bold text-gray-900 md:text-4xl">
              <span>{s.num}</span>
              {s.unit && (
                <span className="text-lg text-gray-400">{s.unit}</span>
              )}
            </div>

            <div className="text-sm leading-5 text-gray-600">{s.label}</div>

            <span className="mono mt-2 inline-flex items-center rounded border border-green-100 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
              {s.tag}
            </span>
          </div>
        ))}
      </div>

      <section
        id="features"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Features
          </p>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Everything sensitive data demands
          </h2>
          <p className="text-base text-gray-600">
            Built for developers, researchers, and organizations with long-term
            confidentiality requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-gray-100 bg-gray-50">
                <f.icon size={18} color="#374151" />
              </div>

              <div className="mb-2 flex items-start justify-between gap-4">
                <h3 className="m-0 text-sm font-semibold text-gray-900">
                  {f.title}
                </h3>
                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600">
                  {f.tag}
                </span>
              </div>

              <p className="m-0 text-sm leading-relaxed text-gray-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-gray-100 bg-gray-50 py-20"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Encryption pipeline
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              4 steps. Zero trust required.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
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
                className={`p-6 ${i < 3 ? "border-r border-gray-100" : ""}`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-gray-400">
                    {step.num}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-gray-100 bg-white">
                  <step.icon size={16} color="#374151" />
                </div>

                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  {step.title}
                </h3>

                <p className="m-0 text-sm leading-relaxed text-gray-600">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Security standards
            </p>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Only NIST standardized cryptography
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              We do not use experimental or unvetted algorithms. Every primitive
              in this stack has been standardized by NIST.
            </p>

            <div className="space-y-3">
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
                  algo: "JWT RS256",
                  std: "RFC 7519",
                  purpose: "Stateless authentication",
                },
              ].map((item) => (
                <div
                  key={item.algo}
                  className="flex items-start gap-3 rounded-xl bg-gray-50/70 px-3 py-3"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50">
                    <FiCheck size={12} color="#15803d" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-mono text-sm font-semibold text-gray-900">
                        {item.algo}
                      </div>
                      <div className="rounded-full bg-white px-2 py-0.5 text-[11px] text-gray-500">
                        {item.std}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.purpose}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 md:mt-10">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-50">
                      <FiFile size={16} color="#16a34a" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-semibold text-gray-900">
                        research_paper_final.pdf
                      </div>
                      <div className="text-xs text-gray-400">
                        2.4 MB · Uploaded just now
                      </div>
                    </div>
                  </div>

                  <div className="relative h-16 w-16 shrink-0">
                    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                      <defs>
                        <linearGradient
                          id="scoreGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#16a34a" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
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
                        stroke="url(#scoreGradient)"
                        strokeWidth="5"
                        strokeDasharray="163.4"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="mono text-base font-bold text-gray-900">
                        100
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.18em] text-gray-400">
                        SCORE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-4">
                {[
                  {
                    icon: Cpu,
                    label: "ML-KEM post-quantum key wrapping",
                    pts: 40,
                    color: "#16a34a",
                    bg: "bg-green-50",
                  },
                  {
                    icon: ShieldCheck,
                    label: "AES-GCM authentication tag",
                    pts: 20,
                    color: "#16a34a",
                    bg: "bg-green-50",
                  },
                  {
                    icon: Fingerprint,
                    label: "SHA-256 integrity hash",
                    pts: 20,
                    color: "#1d4ed8",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: TimerOff,
                    label: "Self-destruct timer configured",
                    pts: 10,
                    color: "#b45309",
                    bg: "bg-yellow-50",
                  },
                  {
                    icon: EyeOff,
                    label: "Private (no public share link)",
                    pts: 10,
                    color: "#b45309",
                    bg: "bg-yellow-50",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-md ${row.bg}`}
                    >
                      <row.icon size={14} color={row.color} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-gray-700">{row.label}</div>
                    </div>

                    <div className="font-mono text-sm font-semibold text-gray-900">
                      {row.pts}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Total score</div>
                <div className="mono text-xl font-semibold text-gray-900">
                  100
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Use cases
          </p>
          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            Built for data that can't be compromised
          </h2>
          <p className="max-w-xl text-base text-gray-600">
            Wherever confidentiality has to outlast the next decade of
            computing, PQC Cloud Storage fits in.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Financial Records",
              desc: "Store statements, audits, and transaction logs with hybrid AES + ML-KEM encryption built to government-grade standards.",
              image:
                "https://plus.unsplash.com/premium_photo-1679923813998-6603ee2466c5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Healthcare Research",
              desc: "Protect patient records and clinical research data with encryption designed to stay secure through the quantum transition.",
              image:
                "https://images.unsplash.com/photo-1543333995-a78aea2eee50",
            },
            {
              title: "Legal Compliance",
              desc: "Keep case files, contracts, and privileged communications sealed with a tamper-evident, chained audit trail.",
              image:
                "https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=1111&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Academic R&D",
              desc: "Share unpublished research and datasets with collaborators without exposing raw files to any third party, ever.",
              image:
                "https://plus.unsplash.com/premium_photo-1661374880675-0c79f7b1dad5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Government & Defense",
              desc: "Meet long-term confidentiality mandates with NIST FIPS 203 post-quantum key encapsulation.",
              image:
                "https://images.unsplash.com/photo-1760872646618-13594fc00567",
            },
            {
              title: "Enterprise IT",
              desc: "Give engineering and ops teams a zero-trust drop-in for secrets, backups, and source archives with self-destruct controls.",
              image:
                "https://images.unsplash.com/photo-1606857521015-7f9fcf423740",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
            >
              <div className="h-44 w-full overflow-hidden">
                <img
                  src={`${item.image}?w=600&auto=format&fit=crop&q=60`}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-gray-700">
                  {item.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-gray-500">
                  {item.desc}
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-gray-900 hover:cursor-pointer">
                  <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out group-hover:mr-2 group-hover:max-w-[100px]">
                    View more
                  </span>
                  <FiArrowRight
                    size={16}
                    className="text-gray-900 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-28 max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="inline-flex rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700">
            Meet the Team
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
            Built by passionate engineers.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            X0RS is a collaborative project focused on building a modern
            post-quantum secure cloud storage platform with privacy at its core.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:rotate-0 hover:shadow-2xl ${
                index === 0
                  ? "-rotate-3"
                  : index === 1
                    ? "rotate-2"
                    : index === 2
                      ? "-rotate-2"
                      : index === 3
                        ? "rotate-3"
                        : "-rotate-2"
              }`}
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-gray-200 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {member.role}
              </p>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {member.description}
              </p>
              <a
                href={member.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center text-sm font-semibold text-gray-900 transition-all duration-300 group-hover:translate-x-2"
              >
                View Profile
                <FiChevronRight className="ml-2" />
              </a>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative mt-24 rounded-t-[40px] bg-[#0f1420] px-6 pb-8 pt-24 text-white md:px-10">
        <div className="mx-auto mb-4 flex max-w-7xl flex-col items-start justify-between gap-8 pb-4 lg:flex-row">
          <div className="max-w-[220px] flex-shrink-0">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
                <TbCloudComputing size={18} className="text-black" />
              </div>
              <span className="text-lg font-bold text-white">XORS</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Post-quantum secure cloud storage built on NIST standardized
              cryptography.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4 lg:mx-4">
            {footerSections.map((section) => (
              <div key={section.heading}>
                <h4 className="mb-4 text-sm font-bold text-white">
                  {section.heading}
                </h4>

                <ul className="flex flex-col gap-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-sm text-gray-400 transition-colors duration-150 hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="w-full flex-shrink-0 lg:w-64">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <span className="mb-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-300">
                Stay Updated
              </span>
              <h4 className="text-lg font-semibold text-white">
                Security updates
              </h4>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-4 space-y-2.5"
              >
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-white/25 focus:bg-white/10"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  Subscribe
                </button>
                <p className="mt-3 text-[11px] text-gray-500">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <a
            href="#top"
            className="flex items-center gap-2 text-white text-sm font-semibold hover:underline underline-offset-4 transition-all duration-150"
          >
            Back to top
            <FiArrowUp size={14} />
          </a>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-white">
              Site Terms
            </a>
            <span className="text-gray-500">
              2026 XORS Cloud Storage. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((s, i) => {
              const Icon = s.icon;

              return (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </main>
  );
}
