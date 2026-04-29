import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          return null;
        }

        try {
          const payload: any = { password: credentials.password };
          
          if (credentials.email) {
            payload.email = credentials.email;
          } else if (credentials.phone) {
            payload.phone = credentials.phone;
          } else {
            return null;
          }

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            payload,
            { withCredentials: true }
          );

          if (response.data.success) {
            const { user, token, refreshToken } = response.data.data;

            if (typeof window !== 'undefined') {
              localStorage.setItem('refreshToken', refreshToken);
            }

            return {
              id: user.id,
              email: user.email,
              phone: user.phone,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
              role: user.role,
              accessToken: token,
            };
          }
          return null;
        } catch (error: any) {
          console.error('Login error:', error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };