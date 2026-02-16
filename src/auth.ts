import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getAuthUserByEmail } from "@/lib/auth/convex-users";
import { issueConvexToken } from "@/lib/auth/convex-token";
import { verifyPassword } from "@/lib/auth/password";
import { normalizeEmail, signInSchema } from "@/lib/auth/validators";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Email + Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const email = normalizeEmail(parsed.data.email);
        const user = await getAuthUserByEmail(email);
        if (!user) {
          return null;
        }

        const validPassword = verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );
        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.sub || !session.user) {
        return session;
      }

      session.user.id = token.sub;
      session.user.email =
        typeof token.email === "string" ? token.email : session.user.email;
      session.user.name =
        typeof token.name === "string" ? token.name : session.user.name;
      session.convexToken = await issueConvexToken({
        subject: token.sub,
        email: session.user.email,
        name: session.user.name,
      });

      return session;
    },
  },
});
