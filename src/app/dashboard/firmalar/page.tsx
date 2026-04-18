import { prisma } from '@/lib/prisma'
import FirmalarClient from './components/FirmalarClient'

export const dynamic = 'force-dynamic' // Her istekte veritabanını güncel çeker

export default async function FirmalarPage() {
  // Prisma üzerinden doğrudan veri çekilir (Waterfall engellenir)
  const firms = await prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <FirmalarClient initialFirms={firms} />
  )
}
