import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const accident = await prisma.workAccident.findUnique({
      where: { id: params.id },
      include: {
        firm: true,
      }
    })
    if (!accident) {
      return NextResponse.json({ error: 'Kaza bulunamadı' }, { status: 404 })
    }
    return NextResponse.json(accident)
  } catch (error) {
    return NextResponse.json({ error: 'DB hatası' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Beklenen model objeleri ile Prisma schema uyumluluğu
    const data = {
      firmId: body.firmId,
      injuredName: body.injuredName || '',
      accidentDate: new Date(body.accidentDate),
      accidentTime: body.accidentTime || '12:00',
      location: body.location || '',
      description: body.description || '',
      injuredBodyPart: body.injuredBodyPart || '',
      injuryType: body.injuryType || '',
      rootCause: body.rootCause || '',
      preventiveActions: body.preventiveActions || '',
      status: body.status || 'REPORTED',
    }

    const updatedAccident = await prisma.workAccident.update({
      where: { id: params.id },
      data
    })
    
    return NextResponse.json(updatedAccident)
  } catch (error) {
    console.error('API PUT Kazalar Error:', error)
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.workAccident.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 })
  }
}
