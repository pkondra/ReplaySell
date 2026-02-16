import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;

function normalizePassword(value: string) {
  return value.normalize("NFKC");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(
    normalizePassword(password),
    salt,
    SCRYPT_KEY_LENGTH,
  ).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedHash] = storedHash.split(":");
  if (
    algorithm !== "scrypt" ||
    !salt ||
    !expectedHash
  ) {
    return false;
  }

  const actual = scryptSync(
    normalizePassword(password),
    salt,
    SCRYPT_KEY_LENGTH,
  );
  const expected = Buffer.from(expectedHash, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}
