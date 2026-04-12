from pydantic import BaseModel 
from typing import Optional

class EncryptResponse(BaseModel):
    encrypted_file: str      # base64 encoded encrypted bytes
    aes_key_encrypted: str   # ML-KEM wrapped AES key
    iv: str                  # base64 encoded IV
    tag: str                 # base64 encoded GCM auth tag
    encryption_type: str     # hybrid or aes-only
    original_size: int       # original file size in bytes
    encrypted_size: int      # encrypted file size in bytes

class DecryptRequest(BaseModel):
    encrypted_file: str
    aes_key_encrypted: str
    iv: str
    tag: str
    encryption_type: str

class HealthResponse(BaseModel):
    status: str
    kyber_mode: str
    aes_mode: str
    version: str
