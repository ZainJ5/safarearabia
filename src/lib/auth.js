import NextAuth, { CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { authConfig } from './auth.config';

class AccountInactiveError extends CredentialsSignin {
  code = 'account_inactive';
}
class InvalidPasswordError extends CredentialsSignin {
  code = 'invalid_password';
}
class NoUserFoundError extends CredentialsSignin {
  code = 'no_user_found';
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new NoUserFoundError();
        }

        if (user.status !== 1) {
          throw new AccountInactiveError();
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new InvalidPasswordError();
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.fname} ${user.lname}`.trim(),
          image: user.image ? `/uploads/users/${user.image}` : null,
          role: user.role,
          fname: user.fname,
          lname: user.lname,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fname = user.fname;
        token.lname = user.lname;
      }

      // Handle Google OAuth — create or find user in DB
      // Note: We need this logic here because it uses Mongoose
      if (account?.provider === 'google') {
        await dbConnect();
        const existingUser = await User.findOne({ email: token.email });

        if (existingUser) {
          token.id = existingUser._id.toString();
          token.role = existingUser.role;
          token.fname = existingUser.fname;
          token.lname = existingUser.lname;
        } else {
          const newUser = await User.create({
            fname: token.name?.split(' ')[0] || '',
            lname: token.name?.split(' ').slice(1).join(' ') || '',
            email: token.email,
            image: token.picture,
            provider: 'google',
            provider_id: account.providerAccountId,
            role: 3,
            status: 1,
            email_verified_at: new Date(),
            wallet_balance: 0,
          });
          token.id = newUser._id.toString();
          token.role = 3;
          token.fname = newUser.fname;
          token.lname = newUser.lname;
        }
      }

      return token;
    },
  },
});
