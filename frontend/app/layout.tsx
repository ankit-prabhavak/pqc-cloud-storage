import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://pqcstorage.io'),
  title: {
    default: 'PQC Cloud Storage — Post-Quantum Encrypted File Storage',
    template: '%s | PQC Cloud Storage',
  },
  description:
    'Experience quantum-safe file storage using client-side encryption. Protect your sensitive data with AES-256-GCM and ML-KEM-768 zero-knowledge storage.',
  keywords: [
    'post-quantum encryption',
    'client-side AES-256 encryption',
    'zero-knowledge cloud storage',
    'ML-KEM',
    'quantum-safe',
    'secure file storage',
    'NIST FIPS 203',
  ],
  authors: [{ name: 'PQC Cloud Storage' }],
  creator: 'PQC Cloud Storage',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pqcstorage.io',
    siteName: 'PQC Cloud Storage',
    title: 'PQC Cloud Storage — Post-Quantum Encrypted File Storage',
    description:
      'Experience quantum-safe file storage using client-side encryption. Protect your sensitive data with AES-256-GCM and ML-KEM-768 zero-knowledge storage.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PQC Cloud Storage — Quantum-Safe Encrypted Cloud Storage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PQC Cloud Storage — Post-Quantum Encrypted File Storage',
    description:
      'Experience quantum-safe file storage using client-side encryption. Protect your sensitive data with AES-256-GCM and ML-KEM-768 zero-knowledge storage.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-[#0B0A0C] text-[#F5F1EE]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}