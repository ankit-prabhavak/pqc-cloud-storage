import type { Metadata } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://pqcstorage.io'),
  title: {
    default: 'PQC Cloud Storage — Post-Quantum Encrypted File Storage',
    template: '%s | PQC Cloud Storage',
  },
  description:
    'Secure cloud storage with client-side AES-256 encryption and ML-KEM post-quantum key encapsulation. Zero-knowledge cloud storage — your plaintext never leaves your device.',
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
      'Client-side AES-256 encryption with ML-KEM post-quantum key wrapping. Zero-knowledge cloud storage — your files are encrypted before they leave your device.',
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
      'Client-side AES-256 + ML-KEM post-quantum encryption. Zero plaintext ever stored on our servers.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable} antialiased bg-[#0B0A0C] text-[#F5F1EE]`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}