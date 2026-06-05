export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fname = user.fname;
        token.lname = user.lname;
        token.custom_id = user.custom_id ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.fname = token.fname;
        session.user.lname = token.lname;
        session.user.custom_id = token.custom_id ?? null;
      }
      return session;
    },
  },
  providers: [], // Add providers with Node.js dependencies in auth.js
};
