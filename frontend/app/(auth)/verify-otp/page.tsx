"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { FiShield, FiArrowRight, FiMail } from "react-icons/fi";
import { Suspense } from "react";

function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!userId) router.replace("/register");
  }, [userId]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = Math.min(pasted.length, 5);
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6)
      return setError("Please enter the complete 6-digit code");
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { userId, otp: code });
      router.push("/login?verified=true");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    setError("");
    try {
      await api.post("/auth/resend-otp", { userId });
      setSuccess("New OTP sent to your email");
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-white flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
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
            <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
              PQC Storage
            </span>
          </Link>
        </div>

        {/* Email icon */}
        <div
          style={{
            width: 52,
            height: 52,
            background: "#f9fafb",
            border: "1.5px solid #e5e7eb",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <FiMail size={22} color="#111827" />
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Check your email
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#6b7280",
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          We sent a 6-digit verification code to{" "}
          <span style={{ color: "#111827", fontWeight: 600 }}>
            {email || "your email address"}
          </span>
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            style={{
              padding: "12px 16px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 13, color: "#15803d", margin: 0 }}>
              {success}
            </p>
          </div>
        )}

        {/* OTP inputs */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 24,
              justifyContent: "space-between",
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 52,
                  height: 58,
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "DM Mono, monospace",
                  color: "#111827",
                  border: `1.5px solid ${digit ? "#111827" : "#e5e7eb"}`,
                  borderRadius: 12,
                  outline: "none",
                  background: digit ? "#f9fafb" : "#fff",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#111827")}
                onBlur={(e) => {
                  if (!digit) e.target.style.borderColor = "#e5e7eb";
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor:
                loading || otp.join("").length < 6 ? "not-allowed" : "pointer",
              background: otp.join("").length < 6 ? "#f3f4f6" : "#111827",
              color: otp.join("").length < 6 ? "#9ca3af" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.15s",
            }}
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Verify email <FiArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Resend */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            Didn't receive it?{" "}
            <button
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: countdown > 0 ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: countdown > 0 ? "#9ca3af" : "#111827",
              }}
            >
              {resending
                ? "Sending..."
                : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend code"}
            </button>
          </p>
        </div>

        {/* Back link */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid #f0f0f0",
            textAlign: "center",
          }}
        >
          <Link
            href="/register"
            style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}
          >
            ← Back to registration
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              border: "2px solid #e5e7eb",
              borderTopColor: "#111827",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      }
    >
      <VerifyOTPPage />
    </Suspense>
  );
}
