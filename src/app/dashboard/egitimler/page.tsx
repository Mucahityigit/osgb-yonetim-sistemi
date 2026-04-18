import { prisma } from '@/lib/prisma'
import EgitimlerClient from './EgitimlerClient'

export const dynamic = 'force-dynamic'

export default async function EgitimlerPage() {
  const [trainings, firms] = await Promise.all([
    prisma.training.findMany({
      select: { id: true, firmId: true, trainingTitle: true, trainingDate: true, durationHours: true, trainerName: true, trainerCert: true, trainingType: true, location: true, content: true, createdById: true, firm: { select: { id: true, name: true } }, _count: { select: { participants: true } } },
      orderBy: { trainingDate: 'desc' },
    }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <EgitimlerClient initialTrainings={JSON.parse(JSON.stringify(trainings))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
