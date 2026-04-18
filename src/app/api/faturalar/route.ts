import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      select: { id: true, firmId: true, invoiceNumber: true, invoiceDate: true, dueDate: true, amount: true, taxAmount: true, totalAmount: true, description: true, status: true, paidAt: true, createdAt: true, firm: { select: { id: true, name: true } } },
      orderBy: { invoiceDate: 'desc' },
    })
    return NextResponse.json(invoices)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.invoiceNumber || !body.invoiceDate || !body.amount) {
      return NextResponse.json({ error: 'Firma, fatura no, tarih ve tutar zorunludur' }, { status: 400 })
    }
    const taxAmount = parseFloat(body.taxAmount) || parseFloat(body.amount) * 0.18
    const invoice = await prisma.invoice.create({
      data: { firmId: body.firmId, invoiceNumber: body.invoiceNumber, invoiceDate: new Date(body.invoiceDate), dueDate: new Date(body.dueDate || body.invoiceDate), amount: parseFloat(body.amount), taxAmount, totalAmount: parseFloat(body.amount) + taxAmount, description: body.description || null },
      select: { id: true, invoiceNumber: true }
    })
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Fatura oluşturma hatası' }, { status: 500 }) }
}
