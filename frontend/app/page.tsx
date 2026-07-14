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
    'Experience quantum-safe file storage using client-side encryption. Protect your sensitive data with AES-256-GCM and ML-KEM-768 zero-knowledge storage.',
  openGraph: {
    title: 'PQC Cloud Storage — Post-Quantum Encrypted File Storage',
    description:
      'Experience quantum-safe file storage using client-side encryption. Protect your sensitive data with AES-256-GCM and ML-KEM-768 zero-knowledge storage.',
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
