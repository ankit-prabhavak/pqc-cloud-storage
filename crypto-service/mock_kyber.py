# Phase 1 placeholder for ML-KEM
# In Phase 3 will replace this entire file with real liboqs ML-KEM
# The function signatures stay identical so nothing else changes

import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# this simulates the ML-KEM shared secret
# in real ML-KEM this is derived from the keypair
_MOCK_MASTER_KEY = os.urandom(32)


def wrap_key(aes_key: bytes) -> str:
    """
    Simulate ML-KEM key encapsulation.
    Real ML-KEM: encapsulate(public_key) -> (ciphertext, shared_secret)
    Mock: encrypt AES key with a fixed master secret
    """
    iv = os.urandom(12)
    aesgcm = AESGCM(_MOCK_MASTER_KEY)
    wrapped = aesgcm.encrypt(iv, aes_key, None)
    # store iv + wrapped together so unwrap can split them
    return base64.b64encode(iv + wrapped).decode('utf-8')


def unwrap_key(wrapped_b64: str) -> bytes:
    """
    Simulate ML-KEM decapsulation.
    Real ML-KEM: decapsulate(private_key, ciphertext) -> shared_secret
    Mock: decrypt the wrapped AES key using the master secret
    """
    raw = base64.b64decode(wrapped_b64)
    iv = raw[:12]
    wrapped = raw[12:]
    aesgcm = AESGCM(_MOCK_MASTER_KEY)
    return aesgcm.decrypt(iv, wrapped, None)


def get_mode_info() -> str:
    return "mock-symmetric (Phase 1) — replace with liboqs ML-KEM in Phase 3"

