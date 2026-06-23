import { MlKem768 } from 'mlkem'
import { argon2id } from '@noble/hashes/argon2.js'
import { hkdf } from '@noble/hashes/hkdf.js'
import { sha256 } from '@noble/hashes/sha2.js'


// ── Types ─────────────────────────────────────────────────────────────────────

export interface EncryptedPayload {
  encryptedFile: string
  mlkemCiphertext: string
  iv: string
  tag: string
  encryptionType: string
}

export interface MLKEMKeyPair {
  publicKey: Uint8Array
  privateKey: Uint8Array
}

// ── BufferSource helper ───────────────────────────────────────────────────────

function toBufferSource(arr: Uint8Array): ArrayBuffer {
  return arr.buffer.slice(
    arr.byteOffset,
    arr.byteOffset + arr.byteLength
  ) as ArrayBuffer
}

// ── Generate random ML-KEM keypair ────────────────────────────────────────────
// Called once at registration — random seed, not derived from password.
// Private key is then encrypted with master key and stored on the server.

export async function generateMLKEMKeypair(): Promise<MLKEMKeyPair> {
  const kem = new MlKem768()
  const seed = window.crypto.getRandomValues(new Uint8Array(64))
  const [publicKey, privateKey] = await kem.deriveKeyPair(seed)
  return { publicKey, privateKey }
}

// ── Derive master key from password using Argon2id ───────────────────────────
// Used to encrypt/decrypt the ML-KEM private key.
// Argon2id is memory-hard — much more resistant to brute force than PBKDF2.

export function deriveMasterKey(
  password: string,
  email: string
): Uint8Array {
  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(password)
  const salt = encoder.encode(email + '-pqc-master-v1')

  // Argon2id: m=64MB, t=3 iterations, p=1 parallelism
  return argon2id(passwordBytes, salt, {
    m: 65536,  // 64 MB — makes brute force expensive
    t: 3,
    p: 1,
    dkLen: 32  // 256-bit master key
  })
}

// ── Encrypt private key with master key ──────────────────────────────────────
// Called at registration — stores only the encrypted bytes on the server.
// Server cannot decrypt without the user's password.

export async function encryptPrivateKey(
  privateKey: Uint8Array,
  masterKey: Uint8Array
): Promise<{ encryptedKey: string; iv: string }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    toBufferSource(masterKey),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toBufferSource(iv) },
    aesKey,
    toBufferSource(privateKey)
  )

  return {
    encryptedKey: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv)
  }
}

// ── Decrypt private key with master key ──────────────────────────────────────
// Called at login — fetches encrypted private key from server,
// decrypts locally using master key derived from user's password.

export async function decryptPrivateKey(
  encryptedKey: string,
  ivB64: string,
  masterKey: Uint8Array
): Promise<Uint8Array> {
  const iv = fromBase64(ivB64)
  const encryptedBytes = fromBase64(encryptedKey)

  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    toBufferSource(masterKey),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toBufferSource(iv) },
    aesKey,
    toBufferSource(encryptedBytes)
  )

  return new Uint8Array(decrypted)
}

// ── Full hybrid encrypt — AES-GCM file + ML-KEM + HKDF key wrap ──────────────
// Standard KEM-DEM construction:
//   sharedSecret → HKDF → wrapping key → AES-GCM encrypt rawAESKey

export async function encryptFile(
  file: File,
  mlkemPublicKey: Uint8Array,
  encryptionType: 'hybrid' | 'aes-only'
): Promise<EncryptedPayload> {
  const fileBuffer = await file.arrayBuffer()

  // Generate fresh AES-256-GCM key
  const aesKey = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  // Generate fresh IV for file encryption
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  // Encrypt the file — AES-GCM appends 16-byte auth tag automatically
  const encryptedWithTag = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    fileBuffer
  )

  const ciphertext = new Uint8Array(encryptedWithTag.slice(0, -16))
  const tag = new Uint8Array(encryptedWithTag.slice(-16))

  // Export raw AES key bytes for wrapping
  const rawAESKey = new Uint8Array(
    await window.crypto.subtle.exportKey('raw', aesKey)
  )

  let mlkemCiphertext: Uint8Array

  if (encryptionType === 'hybrid') {
    const kem = new MlKem768()

    // ML-KEM encapsulation — produces KEM ciphertext + shared secret
    const [ct, sharedSecret] = await kem.encap(mlkemPublicKey)

    // HKDF: derive a 256-bit AES wrapping key from the ML-KEM shared secret
    const wrappingKeyBytes = hkdf(
      sha256,
      sharedSecret,
      undefined,              // no salt — sharedSecret is already high entropy
      new TextEncoder().encode('pqc-storage-wrap-v1'),  // domain separation label
      32                      // 256-bit wrapping key
    )

    // Import wrapping key for AES-GCM
    const wrappingKey = await window.crypto.subtle.importKey(
      'raw',
      toBufferSource(wrappingKeyBytes),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )

    // Fresh IV for key wrapping
    const wrapIv = window.crypto.getRandomValues(new Uint8Array(12))

    // Wrap the raw AES key
    const wrappedAESKey = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: toBufferSource(wrapIv) },
      wrappingKey,
      toBufferSource(rawAESKey)
    )

    // Pack: ML-KEM ciphertext (1088 B) | wrapIv (12 B) | wrappedAESKey (48 B = 32 + 16 tag)
    const wrappedBytes = new Uint8Array(wrappedAESKey)
    const packed = new Uint8Array(ct.length + 12 + wrappedBytes.length)
    packed.set(ct, 0)
    packed.set(wrapIv, ct.length)
    packed.set(wrappedBytes, ct.length + 12)
    mlkemCiphertext = packed

  } else {
    // aes-only mode — raw key stored directly (no PQC wrapping)
    mlkemCiphertext = rawAESKey
  }

  return {
    encryptedFile: toBase64(ciphertext),
    mlkemCiphertext: toBase64(mlkemCiphertext),
    iv: toBase64(iv),
    tag: toBase64(tag),
    encryptionType
  }
}

// ── Full hybrid decrypt — ML-KEM + HKDF key unwrap + AES-GCM file decrypt ────

export async function decryptFile(
  payload: EncryptedPayload,
  mlkemPrivateKey: Uint8Array,
  encryptionType: 'hybrid' | 'aes-only'
): Promise<ArrayBuffer> {
  const encryptedBytes = fromBase64(payload.encryptedFile)
  const iv = fromBase64(payload.iv)
  const tag = fromBase64(payload.tag)
  const mlkemCiphertextBytes = fromBase64(payload.mlkemCiphertext)

  let rawAESKey: Uint8Array

  if (encryptionType === 'hybrid') {
    const ML_KEM_CT_SIZE = 1088  // fixed for ML-KEM-768

    // Unpack: ML-KEM ciphertext | wrapIv | wrappedAESKey
    const ct = mlkemCiphertextBytes.slice(0, ML_KEM_CT_SIZE)
    const wrapIv = mlkemCiphertextBytes.slice(ML_KEM_CT_SIZE, ML_KEM_CT_SIZE + 12)
    const wrappedAESKey = mlkemCiphertextBytes.slice(ML_KEM_CT_SIZE + 12)

    // ML-KEM decapsulation — recovers shared secret
    const kem = new MlKem768()
    const sharedSecret = await kem.decap(ct, mlkemPrivateKey)

    // HKDF: recover the same wrapping key
    const wrappingKeyBytes = hkdf(
      sha256,
      sharedSecret,
      undefined,
      new TextEncoder().encode('pqc-storage-wrap-v1'),
      32
    )

    // Import wrapping key for AES-GCM decryption
    const wrappingKey = await window.crypto.subtle.importKey(
      'raw',
      toBufferSource(wrappingKeyBytes),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )

    // Unwrap the AES key
    const decryptedAESKey = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: toBufferSource(wrapIv) },
      wrappingKey,
      toBufferSource(wrappedAESKey)
    )

    rawAESKey = new Uint8Array(decryptedAESKey)

  } else {
    rawAESKey = mlkemCiphertextBytes
  }

  // Import AES key and decrypt the file
  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    toBufferSource(rawAESKey),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )

  // Reassemble ciphertext + auth tag for AES-GCM
  const combined = new Uint8Array(encryptedBytes.length + tag.length)
  combined.set(encryptedBytes, 0)
  combined.set(tag, encryptedBytes.length)

  return window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toBufferSource(iv) },
    aesKey,
    combined
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function fromBase64(b64: string): Uint8Array {
  return new Uint8Array(
    atob(b64).split('').map(c => c.charCodeAt(0))
  )
}