import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const ppe = await prisma.ppeDistribution.update({ where: { id: params.id }, data: { ppeType: body.ppeType, ppeStandard: body.ppeStandard || null, quantity: parseInt(body.quantity) || 1, distributionDate: new Date(body.distributionDate), renewalDate: body.renewalDate ? new Date(body.renewalDate) : null, isReturned: body.isReturned ?? false } })
    return NextResponse.json(ppe)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await prisma.ppeDistribution.delete({ where: { id: params.id } }); return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
