import type { Metadata } from 'next'

/** Upload is private — never index it. */
export const metadata: Metadata = {
  title: 'Upload File',
  robots: { index: false, follow: false },
}

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return children
}
