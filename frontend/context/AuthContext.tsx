"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  generateMLKEMKeypair,
  deriveMasterKey,
  encryptPrivateKey,
  decryptPrivateKey,
  MLKEMKeyPair,
  toBase64,
  fromBase64,
} from "@/lib/crypto";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  keypair: MLKEMKeyPair | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  initializeKeypair: (password: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SS_PRIV_ENC = "pqc_priv_enc";
const SS_PRIV_IV = "pqc_priv_iv";
const SS_PUB = "pqc_pub";
const SS_PRIV_RAW = "pqc_priv_raw"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [keypair, setKeypair] = useState<MLKEMKeyPair | null>(null);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  // restore keypair from sessionStorage on page load
  useEffect(() => {
  const pub = sessionStorage.getItem(SS_PUB)
  const rawPriv = sessionStorage.getItem(SS_PRIV_RAW)

  if (pub && rawPriv) {
    const publicKey = fromBase64(pub)
    const privateKey = new Uint8Array(JSON.parse(rawPriv))
    setKeypair({ publicKey, privateKey })
  }

  refreshUser().finally(() => setLoading(false))
}, [])

  // called from register page after OTP verification
  // generates random keypair and stores encrypted private key on server
  const initializeKeypair = async (password: string, email: string) => {
    // generate truly random ML-KEM keypair
    const kp = await generateMLKEMKeypair();

    // derive master key from password using Argon2id
    const masterKey = deriveMasterKey(password, email);

    // encrypt private key with master key
    const { encryptedKey, iv } = await encryptPrivateKey(
      kp.privateKey,
      masterKey,
    );

    // store encrypted private key on server
    await api.post("/auth/mlkem-privkey", {
      encryptedPrivateKey: encryptedKey,
      encryptedPrivateKeyIv: iv,
    });

    // save public key on server
    await api.post("/auth/mlkem-pubkey", {
      publicKey: toBase64(kp.publicKey),
    });

    // cache in sessionStorage for this session
    sessionStorage.setItem(SS_PUB, toBase64(kp.publicKey));
    sessionStorage.setItem(SS_PRIV_ENC, encryptedKey);
    sessionStorage.setItem(SS_PRIV_IV, iv);

    setKeypair(kp);
  };

  const login = async (email: string, password: string) => {
    await api.post("/auth/login", { email, password });
    await refreshUser();

    // derive master key from password
    const masterKey = deriveMasterKey(password, email);

    // fetch encrypted private key from server
    const res = await api.get("/auth/mlkem-privkey");
    const { encryptedPrivateKey, encryptedPrivateKeyIv } = res.data;

    if (!encryptedPrivateKey) {
      // user registered before this system — initialize keypair now
      const kp = await generateMLKEMKeypair();
      const { encryptedKey, iv } = await encryptPrivateKey(
        kp.privateKey,
        masterKey,
      );

      await api.post("/auth/mlkem-privkey", {
        encryptedPrivateKey: encryptedKey,
        encryptedPrivateKeyIv: iv,
      });

      await api.post("/auth/mlkem-pubkey", {
        publicKey: toBase64(kp.publicKey),
      });

      sessionStorage.setItem(SS_PUB, toBase64(kp.publicKey));
      sessionStorage.setItem(SS_PRIV_ENC, encryptedKey);
      sessionStorage.setItem(SS_PRIV_IV, iv);

      setKeypair(kp);
      sessionStorage.setItem(SS_PRIV_RAW, JSON.stringify(Array.from(kp.privateKey)))
    } else {
      // decrypt private key using master key
      const privateKey = await decryptPrivateKey(
        encryptedPrivateKey,
        encryptedPrivateKeyIv,
        masterKey,
      );

      // get public key from server
      const publicKey = res.data.mlkemPublicKey
        ? fromBase64(res.data.mlkemPublicKey)
        : new Uint8Array();

      const kp: MLKEMKeyPair = { publicKey, privateKey };
      setKeypair(kp);

      sessionStorage.setItem(SS_PRIV_RAW, JSON.stringify(Array.from(kp.privateKey)))

      // also update sessionStorage with fresh public key
      sessionStorage.setItem(SS_PUB, res.data.mlkemPublicKey || "");

      // cache encrypted private key in session
      sessionStorage.setItem(SS_PRIV_ENC, encryptedPrivateKey);
      sessionStorage.setItem(SS_PRIV_IV, encryptedPrivateKeyIv);
    }

    router.push("/dashboard");
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setKeypair(null);
    sessionStorage.removeItem(SS_PUB);
    sessionStorage.removeItem(SS_PRIV_ENC);
    sessionStorage.removeItem(SS_PRIV_IV);
    sessionStorage.removeItem(SS_PRIV_RAW);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        keypair,
        login,
        logout,
        refreshUser,
        initializeKeypair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
