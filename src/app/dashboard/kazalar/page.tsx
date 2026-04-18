import { prisma } from '@/lib/prisma'
import KazalarClient from './components/KazalarClient'

export const dynamic = 'force-dynamic'

export default async function KazalarPage() {
  const [accidents, firms] = await Promise.all([
    prisma.workAccident.findMany({
      include: { firm: true },
      orderBy: { accidentDate: 'desc' },
    }),
    prisma.organization.findMany({
      select: { id: true, name: true }
    })
  ])

  return <KazalarClient initialAccidents={accidents} initialFirms={firms} />
}
