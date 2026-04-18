import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const taxAmount = parseFloat(body.taxAmount) || parseFloat(body.amount) * 0.18
    const inv = await prisma.invoice.update({ where: { id: params.id }, data: { invoiceDate: new Date(body.invoiceDate), dueDate: new Date(body.dueDate), amount: parseFloat(body.amount), taxAmount, totalAmount: parseFloat(body.amount) + taxAmount, description: body.description || null, status: body.status || 'PENDING', paidAt: body.status === 'PAID' ? new Date() : null } })
    return NextResponse.json(inv)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await prisma.invoice.delete({ where: { id: params.id } }); return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
