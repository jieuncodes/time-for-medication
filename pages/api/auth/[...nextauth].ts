import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const fcmToken = ""; //TODO need to edit
      if (account?.provider === "google" && profile) {
        try {
          const response = await axios.post("http://localhost:8000/api/oauth", {
            email: user.email,
            username: profile.name,
            fcmToken: fcmToken,
            provider: "google",
          });
          if (response.status === 200) {
            return true;
          }
        } catch (error) {
          console.error("Error registering user:", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account }) {
      return token;
    },
  },
});
