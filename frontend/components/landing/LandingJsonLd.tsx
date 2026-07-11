/**
 * JSON-LD structured data for the landing page.
 * This is a Server Component — Next.js renders it on the server so crawlers
 * see the structured data in the initial HTML without running any JS.
 */
export default function LandingJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PQC Cloud Storage',
    url: 'https://pqcstorage.io',
    description:
      'Post-quantum secure cloud storage with client-side AES-256-GCM encryption and ML-KEM key encapsulation. Zero-knowledge architecture — your plaintext never leaves your device.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Client-side AES-256-GCM file encryption',
      'ML-KEM post-quantum key encapsulation (NIST FIPS 203)',
      'Zero-knowledge storage — plaintext never transmitted',
      'SHA-256 integrity hashing',
      'Self-destruct file timers',
      'Cryptographic audit trail',
      'Quantum security score per file',
    ],
    creator: {
      '@type': 'Organization',
      name: 'PQC Cloud Storage',
      url: 'https://pqcstorage.io',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
