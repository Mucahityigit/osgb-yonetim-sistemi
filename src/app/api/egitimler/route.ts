import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      select: {
        id: true, firmId: true, trainingTitle: true, trainingDate: true,
        durationHours: true, trainerName: true, trainingType: true, location: true,
        content: true, createdAt: true,
        firm: { select: { id: true, name: true } },
        _count: { select: { participants: true } }
      },
      orderBy: { trainingDate: 'desc' },
    })
    return NextResponse.json(trainings)
  } catch (error) {
    console.error('API GET Trainings Error:', error)
    return NextResponse.json({ error: 'DB bağlantı hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.trainingTitle || !body.trainingDate || !body.trainerName) {
      return NextResponse.json({ error: 'Firma, başlık, tarih ve eğitimci zorunludur' }, { status: 400 })
    }
    const training = await prisma.training.create({
      data: {
        firmId: body.firmId,
        trainingTitle: body.trainingTitle,
        trainingDate: new Date(body.trainingDate),
        durationHours: parseFloat(body.durationHours) || 1,
        trainerName: body.trainerName,
        trainerCert: body.trainerCert || null,
        trainingType: body.trainingType || 'ENTRY',
        location: body.location || 'WORKPLACE',
        isOnline: body.location === 'ONLINE',
        content: body.content || null,
        createdById: body.createdById,
      },
      select: { id: true, trainingTitle: true }
    })
    return NextResponse.json(training, { status: 201 })
  } catch (error) {
    console.error('API POST Trainings Error:', error)
    return NextResponse.json({ error: 'Eğitim oluşturma hatası' }, { status: 500 })
  }
}
