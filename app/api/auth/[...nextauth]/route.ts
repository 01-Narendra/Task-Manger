import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/schema/schema";
import { pages } from "next/dist/build/templates/app-page";
import { signIn } from "next-auth/react";


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }
        const user = await db.select().from(users).where(eq(users.email, credentials.email)).execute();

        if (!user.length || !(await bcrypt.compare(credentials?.password, user[0].passwordHash))) {
          throw new Error("Invalid credentials");
        }
        return { id: user[0].id.toString(), name: user[0].name, email: user[0].email };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" as const },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
