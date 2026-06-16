import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignup: { label: "Is Signup", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        if (credentials.isSignup === "true") {
          const existingUser = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (existingUser) throw new Error("User already exists");
          
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.name || "User",
              credits: 100,
              isAdmin: false // New users are never admins by default
            }
          });
          return { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            credits: user.credits,
            isAdmin: user.isAdmin 
          };
        } else {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user) throw new Error("User not found");
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error("Invalid password");
          
          return { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            credits: user.credits,
            isAdmin: user.isAdmin 
          };
        }
      }
    })
  ],
  pages: { 
    signIn: "/login" 
  },
  session: { 
    strategy: "jwt" 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.credits = (user as any).credits;
        token.isAdmin = (user as any).isAdmin || false; // 👈 Pass isAdmin to the JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.credits = token.credits as number;
        (session.user as any).isAdmin = token.isAdmin as boolean; // 👈 Pass isAdmin to the frontend session
      }
      return session;
    }
  }
}; 