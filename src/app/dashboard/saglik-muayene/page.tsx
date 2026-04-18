import { prisma } from '@/lib/prisma'
import SaglikClient from './SaglikClient'
export const dynamic = 'force-dynamic'
export default async function SaglikMuayenePage() {
  const [exams, firms, employees] = await Promise.all([
    prisma.healthExamination.findMany({ select: { id: true, employeeId: true, firmId: true, examDate: true, examType: true, doctorId: true, result: true, conditions: true, nextExamDate: true, employee: { select: { name: true, tcNo: true } }, firm: { select: { id: true, name: true } }, doctor: { select: { name: true } } }, orderBy: { examDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } }),
    prisma.employee.findMany({ select: { id: true, name: true, firmId: true }, where: { isActive: true } })
  ])
  return <SaglikClient initialExams={JSON.parse(JSON.stringify(exams))} initialFirms={JSON.parse(JSON.stringify(firms))} initialEmployees={JSON.parse(JSON.stringify(employees))} />
}
