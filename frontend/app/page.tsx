/**
 * app/page.tsx — Server Component
 *
 * Exports page-level metadata for the landing page and renders the
 * JSON-LD structured data server-side (visible to crawlers immediately).
 * All interactive / scroll / Lenis logic lives in LandingClient.
 */
import type { Metadata } from 'next'
import LandingClient from '@/components/landing/LandingClient'
import LandingJsonLd from '@/components/landing/LandingJsonLd'

export const metadata: Metadata = {
  title: 'Post-Quantum Encrypted Cloud Storage',
  description:
    'Store files with client-side AES-256-GCM encryption and ML-KEM post-quantum key encapsulation. Zero-knowledge cloud storage — your plaintext never reaches our servers.',
  openGraph: {
    title: 'PQC Cloud Storage — Post-Quantum Encrypted File Storage',
    description:
      'Client-side AES-256 + ML-KEM post-quantum encryption. Zero plaintext stored. NIST FIPS 203 compliant.',
    url: 'https://pqcstorage.io',
  },
}

export default function LandingPage() {
  return (
    <>
      {/* JSON-LD is server-rendered — crawlers see it in the initial HTML */}
      <LandingJsonLd />
      <LandingClient />
    </>
  )
}
