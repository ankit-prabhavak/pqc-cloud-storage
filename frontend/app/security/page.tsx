"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { SecurityDashboard } from "@/types";
import {
  FiShield,
  FiLock,
  FiActivity,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiServer,
  FiKey,
  FiRefreshCw,
  FiLogOut,
} from "react-icons/fi";
import { Cpu } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/ui/Navbar";
import NavGradient from "@/components/ui/NavGradient";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function SecurityPage() {
  const [data, setData] = useState<SecurityDashboard | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditValid, setAuditValid] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, auditRes] = await Promise.all([
          api.get("/security/dashboard"),
          api.get("/security/audit"),
        ]);
        setData(dashRes.data);
        setAuditLogs(auditRes.data.logs || []);
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const verifyAuditChain = async () => {
    setVerifying(true);
    try {
      const res = await api.get("/security/audit/verify");
      setAuditValid(res.data.isChainValid);
    } catch {
      setAuditValid(false);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const overview = data?.overview;
  const pqcStatus = data?.pqcStatus;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "var(--font-body), 'Inter', sans-serif",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Navbar */}
      {/* <nav style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <div style={{ width: 28, height: 28, background: '#111827', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiShield size={13} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>PQC Storage</span>
            </Link>
            <div style={{ display: 'flex', gap: 4 }}>
                {[
                { label: 'Dashboard', href: '/dashboard', active: false },
                { label: 'Upload', href: '/upload', active: false },
                { label: 'Security', href: '/security', active: true },
                ].map(item => (
                <Link key={item.href} href={item.href} style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none',
                    color: item.active ? '#111827' : '#6b7280',
                    background: item.active ? '#f3f4f6' : 'transparent',
                }}>
                    {item.label}
                </Link>
                ))}
            </div>
            </div>
            <Link href="/dashboard" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
            ← Back to dashboard
            </Link>
        </nav> */}

      <Navbar />

      <NavGradient>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Security overview
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Monitor your encryption status, audit trail, and active sessions.
          </p>
        </div>

        {/* Top stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Avg security score",
              value:
                overview?.averageSecurityScore != null
                  ? `${overview.averageSecurityScore}/100`
                  : "—",
              icon: <FiShield size={16} color="#6b7280" />,
              sub:
                overview?.averageSecurityScore != null
                  ? overview.averageSecurityScore >= 90
                    ? "Quantum-safe"
                    : overview.averageSecurityScore >= 70
                      ? "Strong"
                      : "Needs attention"
                  : "—",
              subColor:
                overview?.averageSecurityScore != null
                  ? overview.averageSecurityScore >= 90
                    ? "#15803d"
                    : overview.averageSecurityScore >= 70
                      ? "#b45309"
                      : "#dc2626"
                  : "#9ca3af",
            },
            {
              label: "Quantum-safe files",
              value: overview ? String(overview.quantumSafeFiles) : "—",
              icon: <FiLock size={16} color="#6b7280" />,
              sub: `of ${overview?.totalFiles ?? 0} total files`,
              subColor: "#9ca3af",
            },
            {
              label: "AES-only files",
              value: overview ? String(overview.classicalOnlyFiles) : "—",
              icon: <FiServer size={16} color="#6b7280" />,
              sub: "without ML-KEM protection",
              subColor:
                (overview?.classicalOnlyFiles ?? 0) > 0 ? "#b45309" : "#9ca3af",
            },
            {
              label: "Encryption mode",
              value:
                overview?.encryptionPreference === "hybrid"
                  ? "Hybrid"
                  : "AES only",
              icon: <FiKey size={16} color="#6b7280" />,
              sub:
                overview?.encryptionPreference === "hybrid"
                  ? "AES-256 + ML-KEM"
                  : "AES-256-GCM",
              subColor:
                overview?.encryptionPreference === "hybrid"
                  ? "#15803d"
                  : "#9ca3af",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "#fff",
                border: "1px solid #f0f0f0",
                borderRadius: 14,
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {card.label}
                </span>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    background: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#111827",
                  fontFamily: "DM Mono, monospace",
                  marginBottom: 4,
                }}
              >
                {card.value}
              </div>
              <div style={{ fontSize: 12, color: card.subColor }}>
                {card.sub}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {/* PQC status card */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Cpu size={16} color="#374151" />
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Post-quantum status
              </h2>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {pqcStatus ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {[
                    {
                      label: "Algorithm",
                      value: pqcStatus.algorithm,
                      mono: true,
                    },
                    {
                      label: "NIST standard",
                      value: pqcStatus.nistStandard,
                      mono: true,
                    },
                    { label: "Key size", value: pqcStatus.keySize, mono: true },
                    {
                      label: "Security level",
                      value: pqcStatus.securityLevel,
                      mono: false,
                    },
                    {
                      label: "Quantum resistant",
                      value: pqcStatus.quantumResistant ? "Yes" : "No",
                      mono: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: 14,
                        borderBottom: "1px solid #f9fafb",
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#6b7280" }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#111827",
                          fontFamily: item.mono
                            ? "DM Mono, monospace"
                            : "inherit",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 10,
                    }}
                  >
                    <FiCheck size={14} color="#15803d" />
                    <span
                      style={{
                        fontSize: 13,
                        color: "#15803d",
                        fontWeight: 500,
                      }}
                    >
                      System is quantum-safe
                    </span>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#9ca3af" }}>
                  Connect to backend to see PQC status.
                </p>
              )}
            </div>
          </div>

          {/* Audit chain verification */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FiActivity size={16} color="#374151" />
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Audit chain integrity
              </h2>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <p
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                Every action is logged with a SHA-256 hash chain. Each log entry
                signs the previous one making the audit trail tamper-evident.
              </p>

              {auditValid !== null && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    borderRadius: 10,
                    marginBottom: 16,
                    background: auditValid ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${auditValid ? "#bbf7d0" : "#fecaca"}`,
                  }}
                >
                  {auditValid ? (
                    <FiCheck size={15} color="#15803d" />
                  ) : (
                    <FiAlertCircle size={15} color="#dc2626" />
                  )}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: auditValid ? "#15803d" : "#dc2626",
                    }}
                  >
                    {auditValid
                      ? "Audit chain intact — no tampering detected"
                      : "Audit chain compromised — investigate immediately"}
                  </span>
                </div>
              )}

              <button
                onClick={verifyAuditChain}
                disabled={verifying}
                style={{
                  width: "100%",
                  padding: "11px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 10,
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  cursor: verifying ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {verifying ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid #e5e7eb",
                        borderTopColor: "#111827",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />{" "}
                    Verifying...
                  </>
                ) : (
                  <>
                    <FiRefreshCw size={13} /> Verify audit chain
                  </>
                )}
              </button>

              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                  }}
                >
                  Recent audit entries
                </div>
                {auditLogs.slice(0, 5).map((log, i) => (
                  <div
                    key={log._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 0",
                      borderBottom: i < 4 ? "1px solid #f9fafb" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#d1d5db",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#374151",
                          fontFamily: "DM Mono, monospace",
                        }}
                      >
                        {log.action}
                      </span>
                      {log.fileId && (
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>
                          {" "}
                          — {log.fileId.originalName}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {timeAgo(log.timestamp)}
                    </span>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p style={{ fontSize: 13, color: "#9ca3af" }}>
                    No audit entries yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* NIST algorithms used */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Cryptographic primitives
              </h2>
            </div>
            <div style={{ padding: "8px 0" }}>
              {[
                {
                  algo: "AES-256-GCM",
                  std: "FIPS 197",
                  purpose: "File encryption",
                  status: "active",
                },
                {
                  algo: "ML-KEM-768",
                  std: "FIPS 203",
                  purpose: "Key encapsulation",
                  status: "active",
                },
                {
                  algo: "SHA-256",
                  std: "FIPS 180-4",
                  purpose: "Integrity hashing",
                  status: "active",
                },
                {
                  algo: "bcrypt",
                  std: "RFC 2898",
                  purpose: "Password hashing",
                  status: "active",
                },
                {
                  algo: "JWT RS256",
                  std: "RFC 7519",
                  purpose: "Authentication",
                  status: "active",
                },
              ].map((item, i, arr) => (
                <div
                  key={item.algo}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 24px",
                    borderBottom:
                      i < arr.length - 1 ? "1px solid #f9fafb" : "none",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#22c55e",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          fontFamily: "DM Mono, monospace",
                        }}
                      >
                        {item.algo}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        {item.purpose}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6b7280",
                      background: "#f3f4f6",
                      padding: "3px 8px",
                      borderRadius: 5,
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {item.std}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Security actions
              </h2>
            </div>
            <div style={{ padding: "12px" }}>
              {[
                {
                  icon: <FiRefreshCw size={16} color="#374151" />,
                  title: "Verify audit chain",
                  desc: "Check SHA-256 hash chain integrity",
                  action: verifyAuditChain,
                  loading: verifying,
                },
                {
                  icon: <FiShield size={16} color="#374151" />,
                  title: "Security documentation",
                  desc: "NIST FIPS 203 — ML-KEM specification",
                  action: () =>
                    window.open(
                      "https://csrc.nist.gov/pubs/fips/203/final",
                      "_blank",
                    ),
                  loading: false,
                },
                {
                  icon: <FiLogOut size={16} color="#dc2626" />,
                  title: "Revoke all sessions",
                  desc: "Sign out from all other devices",
                  action: async () => {
                    if (
                      window.confirm(
                        "This will sign you out from all other devices. Continue?",
                      )
                    ) {
                      await api.delete("/security/sessions/all");
                      alert("All other sessions revoked successfully.");
                    }
                  },
                  loading: false,
                  danger: true,
                },
              ].map((item, i) => (
                <button
                  key={item.title}
                  onClick={item.action}
                  disabled={item.loading}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.1s",
                    marginBottom: 4,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: item.danger ? "#fef2f2" : "#f9fafb",
                      border: `1px solid ${item.danger ? "#fecaca" : "#f0f0f0"}`,
                      borderRadius: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: item.danger ? "#dc2626" : "#111827",
                        marginBottom: 2,
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </NavGradient>
    </div>
  );
}
