import { prisma } from '@/lib/prisma'
import OlcumlerClient from './OlcumlerClient'
export const dynamic = 'force-dynamic'
export default async function OlcumlerPage() {
  const [measurements, firms] = await Promise.all([
    prisma.periodicMeasurement.findMany({ select: { id: true, firmId: true, measurementType: true, measurementDate: true, performedBy: true, accreditationNo: true, results: true, exceededLimits: true, nextMeasurementDate: true, firm: { select: { id: true, name: true } } }, orderBy: { measurementDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <OlcumlerClient initialMeasurements={JSON.parse(JSON.stringify(measurements))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
