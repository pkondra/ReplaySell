import "server-only";

import { auth } from "@/auth";

export type ConnectDemoSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

export async function requireSessionUser(): Promise<ConnectDemoSessionUser> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    throw new Error("Unauthorized. Please sign in to use Stripe Connect demo flows.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
