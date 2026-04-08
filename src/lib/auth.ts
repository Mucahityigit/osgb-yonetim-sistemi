import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { UserRole } from './authorization'

// Demo kullanıcılar — PostgreSQL yokken uygulamanın çalışması için
const DEMO_USERS: { id: string; email: string; password: string; name: string; role: UserRole; organizationId: string | null }[] = [
  { id: 'demo-admin', email: 'admin@osgb.com', password: 'Admin123!@#$%', name: 'Yönetici Admin', role: 'ADMIN', organizationId: null },
  { id: 'demo-expert', email: 'uzman@osgb.com', password: 'Uzman123!@#$%', name: 'Ahmet Yılmaz', role: 'EXPERT', organizationId: 'org-1' },
  { id: 'demo-doctor', email: 'hekim@osgb.com', password: 'Hekim123!@#$%', name: 'Dr. Zeynep Acar', role: 'DOCTOR', organizationId: 'org-1' },
  { id: 'demo-client', email: 'firma@osgb.com', password: 'Firma123!@#$%', name: 'Kemal Şen', role: 'CLIENT', organizationId: 'org-2' },
]

interface AuthResult {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId: string | null
}

async function authenticateWithDB(email: string, password: string): Promise<AuthResult | null> {
  try {
    const { prisma } = await import('./prisma')
    const bcrypt = await import('bcryptjs')
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    })

    if (!user || !user.isActive) return null

    // Hesap kilitleme kontrolü
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error('Hesabınız geçici olarak kilitlenmiştir. Lütfen daha sonra tekrar deneyin.')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1
      const updateData: Record<string, unknown> = { failedLoginAttempts: failedAttempts }
      if (failedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
      }
      await prisma.user.update({ where: { id: user.id }, data: updateData })
      return null
    }

    // Başarılı giriş
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLogin: new Date() },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      organizationId: user.organizationId,
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('kilitlenmiştir')) throw err
    console.warn('DB bağlantısı yok, demo mod kullanılıyor:', (err as Error).message)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('E-posta ve şifre gereklidir')
        }

        // Önce DB ile dene
        const dbUser = await authenticateWithDB(credentials.email, credentials.password)
        if (dbUser) return dbUser

        // DB yoksa demo kullanıcılar ile dene
        const demoUser = DEMO_USERS.find(
          u => u.email === credentials.email && u.password === credentials.password
        )

        if (demoUser) {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
            organizationId: demoUser.organizationId,
          }
        }

        throw new Error('Geçersiz e-posta veya şifre')
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 60 dakika
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.organizationId = user.organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.organizationId = token.organizationId
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
