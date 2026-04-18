import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const c = await prisma.contract.findUnique({ where: { id: params.id }, include: { firm: { select: { name: true } } } })
    if (!c) return NextResponse.json({ error: 'Sözleşme bulunamadı' }, { status: 404 })
    return NextResponse.json(c)
  } catch { return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const c = await prisma.contract.update({
      where: { id: params.id },
      data: {
        firmId: body.firmId, contractType: body.contractType,
        startDate: new Date(body.startDate), endDate: new Date(body.endDate),
        monthlyFee: parseFloat(body.monthlyFee) || 0,
        paymentTerms: body.paymentTerms || null, isgKatipRef: body.isgKatipRef || null,
        isActive: body.isActive ?? true,
      },
    })
    return NextResponse.json(c)
  } catch (error) {
    console.error('API PUT Contract Error:', error)
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.contract.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
