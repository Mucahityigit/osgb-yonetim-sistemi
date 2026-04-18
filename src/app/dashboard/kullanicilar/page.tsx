import { prisma } from '@/lib/prisma'
import KullanicilarClient from './KullanicilarClient'

export const dynamic = 'force-dynamic'

export default async function KullanicilarPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, phone: true,
      certificateType: true, isActive: true, lastLogin: true, createdAt: true,
      _count: { select: { assignments: true } }
    },
    orderBy: { createdAt: 'desc' },
  })

  return <KullanicilarClient initialUsers={JSON.parse(JSON.stringify(users))} />
}
