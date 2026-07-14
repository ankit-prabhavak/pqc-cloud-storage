import type { Metadata } from 'next'

/** Security page is private — never index it. */
export const metadata: Metadata = {
  title: 'Security',
  robots: { index: false, follow: false },
}

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children
}
