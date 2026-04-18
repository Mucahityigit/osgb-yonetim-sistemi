import { prisma } from '@/lib/prisma'
import RamakKalaClient from './RamakKalaClient'
export const dynamic = 'force-dynamic'
export default async function RamakKalaPage() {
  const [incidents, firms] = await Promise.all([
    prisma.nearMissIncident.findMany({ select: { id: true, firmId: true, incidentDate: true, incidentTime: true, location: true, description: true, hazardType: true, potentialSeverity: true, immediateActions: true, rootCause: true, rootCauseMethod: true, correctiveActions: true, correctiveStatus: true, createdAt: true, firm: { select: { id: true, name: true } } }, orderBy: { incidentDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <RamakKalaClient initialIncidents={JSON.parse(JSON.stringify(incidents))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
