import { prisma } from '@/lib/prisma'
import FaturalarClient from './FaturalarClient'
export const dynamic = 'force-dynamic'
export default async function FaturalarPage() {
  const [invoices, firms] = await Promise.all([
    prisma.invoice.findMany({ select: { id: true, firmId: true, invoiceNumber: true, invoiceDate: true, dueDate: true, amount: true, taxAmount: true, totalAmount: true, description: true, status: true, paidAt: true, firm: { select: { id: true, name: true } } }, orderBy: { invoiceDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <FaturalarClient initialInvoices={JSON.parse(JSON.stringify(invoices))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
