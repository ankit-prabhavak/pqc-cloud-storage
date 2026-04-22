from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from schemas import EncryptResponse, DecryptRequest, HealthResponse
from aes import generate_aes_key, encrypt, decrypt
from mock_kyber import wrap_key, unwrap_key, get_mode_info
from cryptography.exceptions import InvalidTag
import base64

app = FastAPI(
    title="PQC Crypto Service",
    description="AES-256-GCM encryption with ML-KEM key wrapping",
    version="1.0.0"
)

# allow backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        kyber_mode=get_mode_info(),
        aes_mode="AES-256-GCM",
        version="1.0.0"
    )


@app.post("/encrypt", response_model=EncryptResponse)
async def encrypt_file(
    file: UploadFile = File(...),
    encryption_type: str = Form(default="hybrid")
):
    if encryption_type not in ["hybrid", "aes-only"]:
        raise HTTPException(
            status_code=400,
            detail="encryption_type must be hybrid or aes-only"
        )

    data = await file.read()

    if len(data) == 0:
        raise HTTPException(status_code=400, detail="File is empty")

    # generate a fresh AES key for this file
    aes_key = generate_aes_key()

    # encrypt the file
    encrypted_file, iv, tag = encrypt(data, aes_key)

    # protect the AES key
    if encryption_type == "hybrid":
        # wrap with ML-KEM (mock in Phase 1, real in Phase 3)
        aes_key_encrypted = wrap_key(aes_key)
    else:
        # aes-only: store raw key as base64
        # note: weaker security — backend must protect this
        aes_key_encrypted = base64.b64encode(aes_key).decode('utf-8')

    return EncryptResponse(
        encrypted_file=encrypted_file,
        aes_key_encrypted=aes_key_encrypted,
        iv=iv,
        tag=tag,
        encryption_type=encryption_type,
        original_size=len(data),
        encrypted_size=len(base64.b64decode(encrypted_file))
    )


@app.post("/decrypt")
async def decrypt_file(req: DecryptRequest):
    try:
        # recover the AES key
        if req.encryption_type == "hybrid":
            aes_key = unwrap_key(req.aes_key_encrypted)
        else:
            aes_key = base64.b64decode(req.aes_key_encrypted)

        # decrypt the file
        plain = decrypt(req.encrypted_file, req.iv, req.tag, aes_key)

        return Response(
            content=plain,
            media_type="application/octet-stream"
        )

    except InvalidTag:
        # this means the file was tampered with
        raise HTTPException(
            status_code=400,
            detail="Decryption failed — file may have been tampered with"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Decryption failed: {str(e)}"
        )
    
# Note: in a real implementation, we would want to be careful about error messages to avoid leaking information about the failure mode.
