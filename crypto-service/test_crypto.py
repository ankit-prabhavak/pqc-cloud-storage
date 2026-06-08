# run this with: python test_crypto.py
# make sure the venv is active and uvicorn is running on port 8000

import requests
import json
import os

BASE_URL = "http://localhost:8000"

def print_section(title):
    print(f"\n{'='*50}")
    print(f"  {title}")
    print(f"{'='*50}")

def test_health():
    print_section("Health Check")
    res = requests.get(f"{BASE_URL}/health")
    data = res.json()
    print(f"Status:     {data['status']}")
    print(f"AES mode:   {data['aes_mode']}")
    print(f"Kyber mode: {data['kyber_mode']}")
    print(f"Version:    {data['version']}")
    assert res.status_code == 200
    print("PASSED")

def test_encrypt_decrypt_text():
    print_section("Encrypt and Decrypt Text File (hybrid)")

    # create a test file in memory
    content = b"This is a secret message. If you can read this, decryption worked."
    print(f"Original:   {content.decode()}")
    print(f"Size:       {len(content)} bytes")

    # encrypt
    res = requests.post(
        f"{BASE_URL}/encrypt",
        files={"file": ("test.txt", content, "text/plain")},
        data={"encryption_type": "hybrid"}
    )
    assert res.status_code == 200, f"Encrypt failed: {res.text}"
    enc_data = res.json()

    print(f"\nEncrypted file (first 60 chars): {enc_data['encrypted_file'][:60]}...")
    print(f"IV:         {enc_data['iv']}")
    print(f"Tag:        {enc_data['tag']}")
    print(f"Key:        {enc_data['aes_key_encrypted'][:60]}...")
    print(f"Mode:       {enc_data['encryption_type']}")
    print(f"Original size:  {enc_data['original_size']} bytes")
    print(f"Encrypted size: {enc_data['encrypted_size']} bytes")

    # decrypt
    res2 = requests.post(
        f"{BASE_URL}/decrypt",
        json={
            "encrypted_file": enc_data["encrypted_file"],
            "aes_key_encrypted": enc_data["aes_key_encrypted"],
            "iv": enc_data["iv"],
            "tag": enc_data["tag"],
            "encryption_type": enc_data["encryption_type"]
        }
    )
    assert res2.status_code == 200, f"Decrypt failed: {res2.text}"
    decrypted = res2.content
    print(f"\nDecrypted:  {decrypted.decode()}")
    assert decrypted == content
    print("PASSED — original and decrypted match exactly")

def test_encrypt_decrypt_aes_only():
    print_section("Encrypt and Decrypt (aes-only mode)")
    content = b"Testing AES only mode without Kyber key wrapping."

    res = requests.post(
        f"{BASE_URL}/encrypt",
        files={"file": ("test.txt", content, "text/plain")},
        data={"encryption_type": "aes-only"}
    )
    assert res.status_code == 200
    enc_data = res.json()
    print(f"Mode: {enc_data['encryption_type']}")

    res2 = requests.post(
        f"{BASE_URL}/decrypt",
        json={
            "encrypted_file": enc_data["encrypted_file"],
            "aes_key_encrypted": enc_data["aes_key_encrypted"],
            "iv": enc_data["iv"],
            "tag": enc_data["tag"],
            "encryption_type": enc_data["encryption_type"]
        }
    )
    assert res2.status_code == 200
    assert res2.content == content
    print("PASSED")

def test_tamper_detection():
    print_section("Tamper Detection Test")
    print("Encrypting file, then modifying ciphertext, then trying to decrypt...")

    content = b"This file should not decrypt after tampering."

    res = requests.post(
        f"{BASE_URL}/encrypt",
        files={"file": ("test.txt", content, "text/plain")},
        data={"encryption_type": "hybrid"}
    )
    enc_data = res.json()

    # tamper with the encrypted file by changing one character
    tampered = enc_data["encrypted_file"][:-4] + "XXXX"

    res2 = requests.post(
        f"{BASE_URL}/decrypt",
        json={
            "encrypted_file": tampered,
            "aes_key_encrypted": enc_data["aes_key_encrypted"],
            "iv": enc_data["iv"],
            "tag": enc_data["tag"],
            "encryption_type": enc_data["encryption_type"]
        }
    )
    print(f"Response status: {res2.status_code}")
    print(f"Response: {res2.json()['detail']}")
    assert res2.status_code == 400
    print("PASSED — tampered file correctly rejected")

def test_real_file():
    print_section("Encrypt and Decrypt a Real File (PDF or image)")

    # create a fake binary file to simulate a real file
    fake_pdf = os.urandom(1024 * 10)  # 10 KB of random bytes simulating a file
    print(f"File size: {len(fake_pdf)} bytes (simulated binary file)")

    res = requests.post(
        f"{BASE_URL}/encrypt",
        files={"file": ("document.pdf", fake_pdf, "application/pdf")},
        data={"encryption_type": "hybrid"}
    )
    assert res.status_code == 200
    enc_data = res.json()
    print(f"Encrypted size: {enc_data['encrypted_size']} bytes")

    res2 = requests.post(
        f"{BASE_URL}/decrypt",
        json={
            "encrypted_file": enc_data["encrypted_file"],
            "aes_key_encrypted": enc_data["aes_key_encrypted"],
            "iv": enc_data["iv"],
            "tag": enc_data["tag"],
            "encryption_type": enc_data["encryption_type"]
        }
    )
    assert res2.status_code == 200
    assert res2.content == fake_pdf
    print("PASSED — binary file decrypted matches original exactly")


if __name__ == "__main__":
    print("\nPQC Crypto Service — Test Suite")
    print("Make sure uvicorn is running: uvicorn main:app --reload --port 8000\n")

    try:
        test_health()
        test_encrypt_decrypt_text()
        test_encrypt_decrypt_aes_only()
        test_tamper_detection()
        test_real_file()
        print("\n" + "="*50)
        print("  ALL TESTS PASSED")
        print("="*50 + "\n")
    except AssertionError as e:
        print(f"\nTEST FAILED: {e}")
    except requests.exceptions.ConnectionError:
        print("\nCould not connect to crypto service.")
        print("Run this first: uvicorn main:app --reload --port 8000")

        