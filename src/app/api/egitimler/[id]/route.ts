import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const t = await prisma.training.findUnique({ where: { id: params.id }, include: { firm: { select: { name: true } }, participants: true } })
    if (!t) return NextResponse.json({ error: 'Eğitim bulunamadı' }, { status: 404 })
    return NextResponse.json(t)
  } catch { return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const t = await prisma.training.update({
      where: { id: params.id },
      data: {
        firmId: body.firmId, trainingTitle: body.trainingTitle,
        trainingDate: new Date(body.trainingDate),
        durationHours: parseFloat(body.durationHours) || 1,
        trainerName: body.trainerName, trainerCert: body.trainerCert || null,
        trainingType: body.trainingType, location: body.location,
        isOnline: body.location === 'ONLINE', content: body.content || null,
      },
    })
    return NextResponse.json(t)
  } catch (error) {
    console.error('API PUT Training Error:', error)
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.training.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
