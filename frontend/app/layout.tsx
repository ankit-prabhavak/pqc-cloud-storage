import type { Metadata } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'PQC Cloud Storage',
  description: 'Post-Quantum Cryptography Based Secure Cloud Storage'
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