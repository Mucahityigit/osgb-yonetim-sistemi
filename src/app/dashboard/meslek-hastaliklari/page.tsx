import { prisma } from '@/lib/prisma'
import MeslekHastaliklariClient from './MeslekHastaliklariClient'
export const dynamic = 'force-dynamic'
export default async function MeslekHastaliklariPage() {
  const [diseases, firms] = await Promise.all([
    prisma.occupationalDisease.findMany({ select: { id: true, firmId: true, employeeName: true, employeeTcNo: true, diagnosis: true, icd10Code: true, diagnosisDate: true, diagnosisInstitution: true, causativeAgent: true, exposureDuration: true, sgkNotificationDate: true, sgkRefNumber: true, sgkDeadline: true, status: true, jobModification: true, firm: { select: { id: true, name: true } } }, orderBy: { diagnosisDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <MeslekHastaliklariClient initialDiseases={JSON.parse(JSON.stringify(diseases))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
