import "server-only";

import { fetchMutation, fetchQuery } from "convex/nextjs";

import { api } from "@convex/_generated/api";

function getInternalAuthSecret() {
  const value = process.env.AUTH_INTERNAL_SECRET;
  if (!value || value.trim() === "") {
    throw new Error("AUTH_INTERNAL_SECRET is not configured.");
  }
  return value;
}

export async function getAuthUserByEmail(email: string) {
  return await fetchQuery(api.users.getByEmailForAuth, {
    email,
    authSecret: getInternalAuthSecret(),
  });
}

export async function createAuthUser(args: {
  email: string;
  name: string;
  passwordHash: string;
}) {
  return await fetchMutation(api.users.createUserWithPassword, {
    ...args,
    authSecret: getInternalAuthSecret(),
  });
}
