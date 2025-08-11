import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      // For development, always allow sign in
      if (process.env.NODE_ENV === 'development') {
        return true
      }
      
      // TODO: Add Firestore integration when credentials are available
      return true
    },
    async session({ session }: any) {
      return session
    }
  },
  session: { strategy: "jwt" as const },
  pages: {
    signIn: '/signin',
  }
}
