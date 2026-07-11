import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Create your free PQC Cloud Storage account. Store files with client-side AES-256-GCM encryption and ML-KEM post-quantum key protection.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
