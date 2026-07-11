'use client'

import { FiShield, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'

export default function FooterSection() {
  return (
    <footer className="border-t border-border py-16 px-6 bg-bg mt-12">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-[30px] h-[30px] bg-burgundy rounded-lg flex items-center justify-center border border-burgundy-bright/20">
                <FiShield size={14} className="text-text" />
              </div>
              <span className="font-bold text-sm font-display text-text">
                PQC Storage
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-5 max-w-[240px] font-body">
              Post-quantum secure cloud storage. Final year project built on NIST standardized cryptography.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: FiGithub,
                  href: "https://github.com/ankit-prabhavak/pqc-cloud-storage",
                  label: "GitHub Repository",
                },
                { icon: FiTwitter, href: "#", label: "Twitter Profile" },
                { icon: FiLinkedin, href: "#", label: "LinkedIn Profile" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="width-[34px] h-[34px] rounded-lg border border-border flex items-center justify-center text-text-muted hover:border-burgundy hover:text-text transition-colors"
                  style={{ width: '34px', height: '34px' }}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">Product</div>
            <div className="flex flex-col gap-2.5 text-sm text-text-muted font-body">
              {[
                "Dashboard",
                "Upload files",
                "Security score",
                "Audit log",
                "File sharing",
              ].map((item) => (
                <a key={item} href="#" className="hover:text-text transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Security */}
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">Security</div>
            <div className="flex flex-col gap-2.5 text-sm text-text-muted font-mono">
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
                  className="hover:text-text transition-colors text-[13px]"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Project */}
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 font-mono">Project</div>
            <div className="flex flex-col gap-2.5 text-sm text-text-muted font-body">
              {[
                "GitHub repo",
                "Research paper",
                "API docs",
                "Contributing",
                "License (MIT)",
              ].map((item) => (
                <a key={item} href="#" className="hover:text-text transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-7 flex flex-wrap items-center justify-between gap-4">
          <span className="text-[13px] text-text-muted font-mono">
            © 2026 PQC Cloud Storage · Final Year Project
          </span>
          <div className="flex items-center gap-5">
            {["AES-256-GCM", "ML-KEM FIPS 203", "Zero plaintext"].map(
              (label) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-text-muted font-mono"
                >
                  <FiShield size={11} className="text-burgundy" />
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
