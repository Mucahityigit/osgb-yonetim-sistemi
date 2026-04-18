import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const ra = await prisma.riskAssessment.findUnique({ where: { id: params.id }, include: { firm: { select: { name: true } }, expert: { select: { name: true } }, items: true } })
    if (!ra) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json(ra)
  } catch { return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const ra = await prisma.riskAssessment.update({ where: { id: params.id }, data: { method: body.method, validUntil: new Date(body.validUntil), status: body.status } })
    return NextResponse.json(ra)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.riskAssessment.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
