import 'next-auth'

type UserRole = 'ADMIN' | 'EXPERT' | 'DOCTOR' | 'DSP' | 'CLIENT'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: UserRole
      organizationId: string | null
    }
  }

  interface User {
    id: string
    role: UserRole
    organizationId: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    organizationId: string | null
  }
}
