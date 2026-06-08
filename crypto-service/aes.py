import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def generate_aes_key() -> bytes:
    # 32 bytes = 256 bits. os.urandom is cryptographically secure
    return os.urandom(32)


def encrypt(data: bytes, key: bytes) -> tuple[str, str, str]:
    # generate fresh random IV for every single encryption
    # never reuse an IV with the same key — this is critical
    iv = os.urandom(12)  # 96 bits is the recommended GCM IV size

    aesgcm = AESGCM(key)

    # encrypt returns ciphertext + 16 byte auth tag appended at the end
    encrypted = aesgcm.encrypt(iv, data, None)

    # split ciphertext and tag
    ciphertext = encrypted[:-16]
    tag = encrypted[-16:]

    return (
        base64.b64encode(ciphertext).decode('utf-8'),
        base64.b64encode(iv).decode('utf-8'),
        base64.b64encode(tag).decode('utf-8')
    )


def decrypt(
    ciphertext_b64: str,
    iv_b64: str,
    tag_b64: str,
    key: bytes
) -> bytes:
    ciphertext = base64.b64decode(ciphertext_b64)
    iv = base64.b64decode(iv_b64)
    tag = base64.b64decode(tag_b64)

    aesgcm = AESGCM(key)

    # GCM automatically verifies the tag here
    # if the file was tampered with, this raises InvalidTag exception
    return aesgcm.decrypt(iv, ciphertext + tag, None)

