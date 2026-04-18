import { prisma } from '@/lib/prisma'
import KkdClient from './KkdClient'
export const dynamic = 'force-dynamic'
export default async function KkdPage() {
  const [distributions, firms, employees] = await Promise.all([
    prisma.ppeDistribution.findMany({ select: { id: true, firmId: true, employeeId: true, ppeType: true, ppeStandard: true, quantity: true, distributionDate: true, distributedBy: true, renewalDate: true, isReturned: true, firm: { select: { id: true, name: true } }, employee: { select: { name: true } } }, orderBy: { distributionDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } }),
    prisma.employee.findMany({ select: { id: true, name: true, firmId: true }, where: { isActive: true } })
  ])
  return <KkdClient initialDistributions={JSON.parse(JSON.stringify(distributions))} initialFirms={JSON.parse(JSON.stringify(firms))} initialEmployees={JSON.parse(JSON.stringify(employees))} />
}
