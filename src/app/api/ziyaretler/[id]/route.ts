import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const visit = await prisma.siteVisit.findUnique({
      where: { id: params.id },
      include: {
        firm: true,
        expert: true
      }
    })
    if (!visit) {
      return NextResponse.json({ error: 'Ziyaret bulunamadı' }, { status: 404 })
    }
    return NextResponse.json(visit)
  } catch (error) {
    return NextResponse.json({ error: 'DB hatası' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const data = {
      firmId: body.firmId,
      expertId: body.expertId,
      visitDate: new Date(body.visitDate),
      startTime: new Date(`${body.visitDate}T${body.startTime || '09:00'}`),
      endTime: new Date(`${body.visitDate}T${body.endTime || '17:00'}`),
      durationMinutes: parseInt(body.durationMinutes) || 0,
      visitType: body.visitType,
      description: body.description,
      findings: body.findings,
      actions: body.actions,
    }

    const updatedVisit = await prisma.siteVisit.update({
      where: { id: params.id },
      data
    })
    
    return NextResponse.json(updatedVisit)
  } catch (error) {
    console.error('API PUT Ziyaret Error:', error)
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.siteVisit.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 })
  }
}
