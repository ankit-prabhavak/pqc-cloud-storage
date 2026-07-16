"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Stats, FileItem } from "@/types";
import {
  FiShield,
  FiUpload,
  FiFile,
  FiActivity,
  FiMoreVertical,
  FiDownload,
  FiTrash2,
  FiClock,
  FiGrid,
} from "react-icons/fi";
import Navbar from "@/components/ui/Navbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { decryptFile } from "@/lib/crypto";

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

export default function DashboardPage() {
  const { user, logout, loading, keypair } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [statsRes, filesRes] = await Promise.all([
          api.get("/files/stats"),
          api.get("/files"),
        ]);
        setStats(statsRes.data);
        setFiles(filesRes.data.files || []);
        setStorageUsed(statsRes.data.totalStorageUsed ?? 0);
      } catch {
        // handle silently
      } finally {
        setStatsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDelete = async (fileId: string) => {
    setDeleting(fileId);
    try {
      const deletedFile = files.find((f) => f.id === fileId);
      await api.delete(`/files/${fileId}`);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      const deletedSize = deletedFile?.fileSize ?? 0;
      const deletedName = deletedFile?.originalName ?? "Unknown";

      setStorageUsed((prev) => prev - deletedSize);

      setStats((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          totalFiles: Math.max(0, prev.totalFiles - 1),
          totalStorageUsed: Math.max(0, prev.totalStorageUsed - deletedSize),
          recentActivity: [
            {
              _id: `deleted-${fileId}`,
              action: "Deleted file",
              fileId: {
                originalName: deletedName,
              },
              ipAddress: "N/A",
              timestamp: new Date().toISOString(),
            },
            ...prev.recentActivity.slice(0, 5),
          ],
        };
      });
    } catch {
      // handle silently
    } finally {
      setDeleting(null);
      setOpenMenu(null);
    }
  };

  const handleDownload = async (fileId: string, name: string) => {
    if (!keypair) {
      alert("Encryption keys not available. Please log out and log in again.");
      return;
    }

    try {
      const res = await api.get(`/files/download/${fileId}`);
      const {
        encryptedFile,
        mlkemCiphertext,
        iv,
        tag,
        encryptionType,
        mimeType,
      } = res.data;

      const decrypted = await decryptFile(
        { encryptedFile, mlkemCiphertext, iv, tag, encryptionType },
        keypair.privateKey,
        encryptionType,
      );

      const blob = new Blob([decrypted], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please try again.");
    }

    setOpenMenu(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      label: "Total Files",
      value: statsLoading ? "—" : String(stats?.totalFiles ?? 0),
      icon: <FiFile className="h-4 w-4 text-gray-500" />,
      sub: "uploaded",
    },
    {
      label: "Storage Used",
      value: statsLoading ? "—" : formatBytes(stats?.totalStorageUsed ?? 0),
      icon: <FiGrid className="h-4 w-4 text-gray-500" />,
      sub: "encrypted on R2",
    },
    {
      label: "Quantum-safe files",
      value: statsLoading
        ? "—"
        : String(files.filter((f) => f.encryptionType === "hybrid").length),
      icon: <FiShield className="h-4 w-4 text-gray-500" />,
      sub: `of ${files.length} files with ML-KEM`,
    },
    {
      label: "Recent Activity",
      value: statsLoading ? "—" : String(stats?.recentActivity?.length ?? 0),
      icon: <FiActivity className="h-4 w-4 text-gray-500" />,
      sub: "logged actions",
    },
  ];

  const quota = user.storageQuota ?? 100 * 1024 * 1024;
  const usagePercent = Math.round(((storageUsed ?? 0) / quota) * 100);
  const usageWidth = Math.min(((storageUsed ?? 0) / quota) * 100, 100);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Good to see you, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              All your files are encrypted and stored securely.
            </p>
          </div>

          <button
            onClick={() => router.push("/upload")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black sm:w-auto"
          >
            <FiUpload className="h-4 w-4" />
            Upload file
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

              <div className="mb-1 break-words font-mono text-xl font-bold text-gray-900 sm:text-2xl">
                {card.value}
              </div>

              <div className="text-xs text-gray-400">{card.sub}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-700">
              Storage quota
            </span>
            <span className="text-xs text-gray-500 sm:text-sm font-mono">
              {formatBytes(storageUsed ?? 0)} / {formatBytes(quota)}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                (storageUsed ?? 0) / quota > 0.9
                  ? "bg-red-600"
                  : (storageUsed ?? 0) / quota > 0.7
                    ? "bg-amber-500"
                    : "bg-gray-900"
              }`}
              style={{ width: `${usageWidth}%` }}
            />
          </div>

          <div className="mt-2 flex flex-col gap-1 text-[11px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {files.length} of {process.env.NEXT_PUBLIC_MAX_FILES ?? 20} files
              used
            </span>
            <span>{usagePercent}% used</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl  pb-20  border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-gray-900">Your files</h2>
            <span className="font-mono text-xs text-gray-400">
              {files.length} files
            </span>
          </div>

          {files.length === 0 ? (
            <div className="px-4 py-16 text-center sm:px-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                <FiFile className="h-5 w-5 text-gray-400" />
              </div>

              <p className="mb-1 text-sm font-medium text-gray-700">
                No files yet
              </p>
              <p className="mb-5 text-sm text-gray-400">
                Upload your first file to get started
              </p>

              <button
                onClick={() => router.push("/upload")}
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Upload file
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:grid md:grid-cols-[minmax(0,2fr)_120px_140px_120px_80px] md:border-b md:border-gray-100 md:px-6 md:py-3">
                {["Name", "Size", "Encryption", "Uploaded", ""].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <div className="divide-y divide-gray-100">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="relative px-4 py-4 transition hover:bg-gray-50 sm:px-6"
                  >
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,2fr)_120px_140px_120px_80px] md:items-center">
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                            <FiFile className="h-4 w-4 text-gray-500" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {file.originalName}
                            </p>

                            {file.expiresAt && (
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-500">
                                <FiClock className="h-3 w-3" />
                                Expires {timeAgo(file.expiresAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:block">
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 md:hidden">
                          Size
                        </span>
                        <span className="font-mono text-sm text-gray-500">
                          {formatBytes(file.fileSize)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between md:block">
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 md:hidden">
                          Encryption
                        </span>
                        <span
                          className={`inline-flex rounded-md border px-2 py-1 font-mono text-[11px] font-semibold ${
                            file.encryptionType === "hybrid"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-gray-200 bg-gray-50 text-gray-500"
                          }`}
                        >
                          {file.encryptionType === "hybrid"
                            ? "Hybrid"
                            : "AES-256"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between md:block">
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 md:hidden">
                          Uploaded
                        </span>
                        <span className="text-sm text-gray-400">
                          {timeAgo(file.createdAt)}
                        </span>
                      </div>

                      <div className="flex justify-end overflow-visible">
                        <div className="relative">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:bg-gray-100"
                            onClick={() =>
                              setOpenMenu(openMenu === file.id ? null : file.id)
                            }
                            aria-label="Open file actions"
                          >
                            <FiMoreVertical className="h-4 w-4 text-gray-500" />
                          </button>

                          {openMenu === file.id && (
                            <div className="absolute right-0 top-10 z-[100] min-w-[150px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                  handleDownload(file.id, file.originalName)
                                }
                              >
                                <FiDownload className="h-4 w-4" />
                                Download
                              </button>

                              <div className="h-px bg-gray-100" />

                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => handleDelete(file.id)}
                                disabled={deleting === file.id}
                              >
                                <FiTrash2 className="h-4 w-4" />
                                {deleting === file.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {stats?.recentActivity && stats.recentActivity.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-gray-900">
                Recent activity
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {stats.recentActivity.slice(0, 6).map((log) => (
                <div
                  key={log._id}
                  className="flex items-start gap-3 px-4 py-4 sm:px-6"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                    <FiActivity className="h-3.5 w-3.5 text-gray-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{log.action}</span>
                      {log.fileId && (
                        <span className="text-gray-500">
                          {" "}
                          — {log.fileId.originalName}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {log.ipAddress}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-xs text-gray-400">
                    {timeAgo(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {openMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenMenu(null)}
          />
        )}
      </div>
    </div>
  );
}
