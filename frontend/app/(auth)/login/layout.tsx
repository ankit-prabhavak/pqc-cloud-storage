import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your PQC Cloud Storage account to access your encrypted files and manage your post-quantum secured storage.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
