import { prisma } from '@/lib/prisma'
import RiskClient from './RiskClient'
export const dynamic = 'force-dynamic'
export default async function RiskDegerlendirmePage() {
  const [assessments, firms] = await Promise.all([
    prisma.riskAssessment.findMany({ select: { id: true, firmId: true, version: true, method: true, status: true, validUntil: true, createdAt: true, firm: { select: { id: true, name: true } }, expert: { select: { id: true, name: true } }, _count: { select: { items: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <RiskClient initialAssessments={JSON.parse(JSON.stringify(assessments))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
