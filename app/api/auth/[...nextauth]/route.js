import User from "@models/user";
import { connectToDB } from "@utils/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });

      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // check if user alredy exists
        const userExists = await User.findOne({ email: profile.email });

        // Generate a username based on the email
        const username = profile.email.split("@")[0];

        // Ensure the username is between 8-20 characters
        const truncatedUsername = username.slice(0, 20);

        // Check if the generated username is unique
        const uniqueUsername = await User.findOne({
          username: truncatedUsername,
        });

        // If not unique, append a random string to ensure uniqueness
        const finalUsername = uniqueUsername
          ? `${truncatedUsername}-${Math.random().toString(36).substring(2, 8)}`
          : truncatedUsername;

        //new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: finalUsername,
            images: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
