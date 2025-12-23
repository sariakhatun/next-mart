import GoogleProvider from "next-auth/providers/google";
import { getCollection } from "../lib/db";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false; // Safety: email must exist

      try {
        const users = await getCollection("users");

        const existingUser = await users.findOne({ email: user.email });
        if (!existingUser) {
          await users.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date(),
          });
        }

        return true; // allow sign in
      } catch (err) {
        console.error("Error saving user to MongoDB:", err);
        return false;
      }
    },

    async session({ session }) {
      return session; // session object safe
    },
  },
 
};
