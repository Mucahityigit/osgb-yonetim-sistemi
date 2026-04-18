import { prisma } from '@/lib/prisma'
import SozlesmelerClient from './SozlesmelerClient'
export const dynamic = 'force-dynamic'
export default async function SozlesmelerPage() {
  const [contracts, firms] = await Promise.all([
    prisma.contract.findMany({ select: { id: true, firmId: true, contractType: true, startDate: true, endDate: true, monthlyFee: true, paymentTerms: true, isActive: true, isgKatipRef: true, createdAt: true, firm: { select: { id: true, name: true } } }, orderBy: { startDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <SozlesmelerClient initialContracts={JSON.parse(JSON.stringify(contracts))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
