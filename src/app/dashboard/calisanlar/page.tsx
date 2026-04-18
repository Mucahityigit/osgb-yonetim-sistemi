import { prisma } from '@/lib/prisma'
import CalisanlarClient from './CalisanlarClient'

export const dynamic = 'force-dynamic'

export default async function CalisanlarPage() {
  const [employees, firms] = await Promise.all([
    prisma.employee.findMany({
      select: { id: true, firmId: true, tcNo: true, name: true, gender: true, department: true, jobTitle: true, startDate: true, isActive: true, employmentType: true, firm: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <CalisanlarClient initialEmployees={JSON.parse(JSON.stringify(employees))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
