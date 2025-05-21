// src/utils/cryptoHelper.js
import CryptoJS from "crypto-js";

const secretKey = "CraftCartSuperSecretKey2024!@#";

export function encrypt(text) {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encodeURIComponent(ciphertext); // safe for URLs
}

export function decrypt(ciphertext) {
  try {
    const decoded = decodeURIComponent(ciphertext);
    const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
