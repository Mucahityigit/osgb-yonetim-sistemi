import { prisma } from '@/lib/prisma'
import ZiyaretlerClient from './components/ZiyaretlerClient'

export const dynamic = 'force-dynamic'

export default async function ZiyaretlerPage() {
  const [visits, firms] = await Promise.all([
    prisma.siteVisit.findMany({
      include: { firm: true, expert: true },
      orderBy: { visitDate: 'desc' },
    }),
    prisma.organization.findMany({
      select: { id: true, name: true }
    })
  ])

  return <ZiyaretlerClient initialVisits={visits} initialFirms={firms} />
}
