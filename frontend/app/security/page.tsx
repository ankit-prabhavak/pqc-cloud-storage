"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { SecurityDashboard } from "@/types";
import {
  FiShield,
  FiLock,
  FiActivity,
  FiCheck,
  FiAlertCircle,
  FiServer,
  FiKey,
  FiRefreshCw,
  FiLogOut,
} from "react-icons/fi";
import { Cpu } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/ui/Navbar";

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

  const statCards = [
    {
      label: "Avg security score",
      value:
        overview?.averageSecurityScore != null
          ? `${overview.averageSecurityScore}/100`
          : "—",
      icon: <FiShield className="h-4 w-4 text-gray-500" />,
      sub:
        overview?.averageSecurityScore != null
          ? overview.averageSecurityScore >= 90
            ? "Quantum-safe"
            : overview.averageSecurityScore >= 70
              ? "Strong"
              : "Needs attention"
          : "—",
      subClass:
        overview?.averageSecurityScore != null
          ? overview.averageSecurityScore >= 90
            ? "text-green-700"
            : overview.averageSecurityScore >= 70
              ? "text-amber-700"
              : "text-red-600"
          : "text-gray-400",
    },
    {
      label: "Quantum-safe files",
      value: overview ? String(overview.quantumSafeFiles) : "—",
      icon: <FiLock className="h-4 w-4 text-gray-500" />,
      sub: `of ${overview?.totalFiles ?? 0} total files`,
      subClass: "text-gray-400",
    },
    {
      label: "AES-only files",
      value: overview ? String(overview.classicalOnlyFiles) : "—",
      icon: <FiServer className="h-4 w-4 text-gray-500" />,
      sub: "without ML-KEM protection",
      subClass:
        (overview?.classicalOnlyFiles ?? 0) > 0
          ? "text-amber-700"
          : "text-gray-400",
    },
    {
      label: "Encryption mode",
      value:
        overview?.encryptionPreference === "hybrid" ? "Hybrid" : "AES only",
      icon: <FiKey className="h-4 w-4 text-gray-500" />,
      sub:
        overview?.encryptionPreference === "hybrid"
          ? "AES-256 + ML-KEM"
          : "AES-256-GCM",
      subClass:
        overview?.encryptionPreference === "hybrid"
          ? "text-green-700"
          : "text-gray-400",
    },
  ];

  const quickActions = [
    {
      icon: <FiRefreshCw className="h-4 w-4 text-gray-700" />,
      title: "Verify audit chain",
      desc: "Check SHA-256 hash chain integrity",
      action: verifyAuditChain,
      loading: verifying,
    },
    {
      icon: <FiShield className="h-4 w-4 text-gray-700" />,
      title: "Security documentation",
      desc: "NIST FIPS 203 — ML-KEM specification",
      action: () =>
        window.open("https://csrc.nist.gov/pubs/fips/203/final", "_blank"),
      loading: false,
    },
    {
      icon: <FiLogOut className="h-4 w-4 text-red-600" />,
      title: "Revoke all sessions",
      desc: "Sign out from all other devices",
      action: async () => {
        if (
          window.confirm(
            "This will sign you out from all other devices. Continue?"
          )
        ) {
          await api.delete("/security/sessions/all");
          alert("All other sessions revoked successfully.");
        }
      },
      loading: false,
      danger: true,
    },
  ];

  const cryptoPrimitives = [
    {
      algo: "AES-256-GCM",
      std: "FIPS 197",
      purpose: "File encryption",
    },
    {
      algo: "ML-KEM-768",
      std: "FIPS 203",
      purpose: "Key encapsulation",
    },
    {
      algo: "SHA-256",
      std: "FIPS 180-4",
      purpose: "Integrity hashing",
    },
    {
      algo: "bcrypt",
      std: "RFC 2898",
      purpose: "Password hashing",
    },
    {
      algo: "JWT RS256",
      std: "RFC 7519",
      purpose: "Authentication",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Security overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your encryption status, audit trail, and active sessions.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-gray-400">
                  {card.label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                  {card.icon}
                </div>
              </div>

              <div className="mb-1 break-words font-mono text-xl font-bold text-gray-900 sm:text-2xl tabular-nums">
                {card.value}
              </div>

              <div className={`text-xs ${card.subClass}`}>{card.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
              <Cpu className="h-4 w-4 text-gray-700" />
              <h2 className="text-sm font-semibold text-gray-900">
                Post-quantum status
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              {pqcStatus ? (
                <div className="flex flex-col gap-4">
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
                    {
                      label: "Key size",
                      value: pqcStatus.keySize,
                      mono: true,
                    },
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
                      className="flex flex-col gap-1 border-b border-gray-50 pb-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span
                        className={`text-sm font-semibold text-gray-900 ${
                          item.mono ? "font-mono" : ""
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                    <span className="text-sm font-medium text-green-700">
                      System is quantum-safe
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Connect to backend to see PQC status.
                </p>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
              <FiActivity className="h-4 w-4 text-gray-700" />
              <h2 className="text-sm font-semibold text-gray-900">
                Audit chain integrity
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              <p className="mb-5 text-sm leading-6 text-gray-500">
                Every action is logged with a SHA-256 hash chain. Each log entry
                signs the previous one making the audit trail tamper-evident.
              </p>

              {auditValid !== null && (
                <div
                  className={`mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 ${
                    auditValid
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  {auditValid ? (
                    <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                  ) : (
                    <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  )}

                  <span
                    className={`text-sm font-medium ${
                      auditValid ? "text-green-700" : "text-red-600"
                    }`}
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
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {verifying ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="h-4 w-4" />
                    Verify audit chain
                  </>
                )}
              </button>

              <div className="mt-5">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                  Recent audit entries
                </div>

                {auditLogs.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div
                        key={log._id}
                        className="flex items-start gap-3 py-3"
                      >
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />

                        <div className="min-w-0 flex-1">
                          <span className="font-mono text-sm font-medium text-gray-700">
                            {log.action}
                          </span>
                          {log.fileId && (
                            <span className="text-sm text-gray-400">
                              {" "}
                              — {log.fileId.originalName}
                            </span>
                          )}
                        </div>

                        <span className="whitespace-nowrap text-xs text-gray-400">
                          {timeAgo(log.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No audit entries yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-gray-900">
                Cryptographic primitives
              </h2>
            </div>

            <div className="divide-y divide-gray-50">
              {cryptoPrimitives.map((item) => (
                <div
                  key={item.algo}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />

                    <div className="min-w-0">
                      <div className="truncate font-mono text-sm font-semibold text-gray-900">
                        {item.algo}
                      </div>
                      <div className="text-xs text-gray-400">{item.purpose}</div>
                    </div>
                  </div>

                  <span className="inline-flex w-fit rounded-md bg-gray-100 px-2 py-1 font-mono text-[11px] font-semibold text-gray-600">
                    {item.std}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-gray-900">
                Security actions
              </h2>
            </div>

            <div className="p-3">
              {quickActions.map((item) => (
                <button
                  key={item.title}
                  onClick={item.action}
                  disabled={item.loading}
                  className="mb-1 flex w-full items-start gap-3 rounded-xl bg-white px-3 py-3 text-left transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      item.danger
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-sm font-semibold ${
                        item.danger ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}