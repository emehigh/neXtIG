import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/User';
import { connectToDatabase } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      try {
        // Store the user id from MongoDB to session
        const sessionUser = await User.findOne({ email: session.user.email });

        // Update session to include user id and username
        session.user.id = sessionUser._id.toString();
        session.user.username = sessionUser.username;

        return session;
      } catch (error) {
        console.error("Error retrieving user data:", error);
        return session;
      }
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDatabase();

        // Check if user already exists
        const userExists = await User.findOne({ email: profile.email });
        console.log(profile.email)

        // If not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking if user exists: ", error.message);
        return false;
      }
    },
  }
});

export { handler as GET, handler as POST };