// src/utils/cryptoHelper.js
const secret = "mySecretKey123"; // simple key

export function encrypt(text) {
  return btoa(`${text}-${secret}`);
}

export function decrypt(encrypted) {
  try {
    const decoded = atob(encrypted);
    const [text] = decoded.split("-");
    return text;
  } catch {
    return null;
  }
}
