// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

interface UserWithUserType {
  id: number
  email: string
  name: string | null
  password: string
  userType: string
  createdAt: Date
  updatedAt: Date
}

interface UserSession {
  id: string
  email: string
  name: string | null
  userType?: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      userType: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    userType: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('[NextAuth] Attempting login for:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('[NextAuth] Missing email or password')
          throw new Error('Введите email и пароль')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        console.log('[NextAuth] User found:', user ? 'Yes' : 'No')

        if (!user || !user.password) {
          console.log('[NextAuth] User not found or no password')
          throw new Error('Неверный email или пароль')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        console.log('[NextAuth] Password valid:', isPasswordValid)

        if (!isPasswordValid) {
          console.log('[NextAuth] Invalid password')
          throw new Error('Неверный email или пароль')
        }

        const userWithUserType = user as UserWithUserType
        console.log('[NextAuth] Login successful, userType:', userWithUserType.userType)

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          userType: userWithUserType.userType
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('[NextAuth] JWT callback, user:', user)
      if (user) {
        token.id = user.id
        token.userType = (user as UserSession).userType
      }
      return token
    },
    async session({ session, token }) {
      console.log('[NextAuth] Session callback, token:', token)
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.userType = (token.userType as string) || 'student'
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }