import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const accidents = await prisma.workAccident.findMany({
      include: { firm: true, expert: true },
      orderBy: { accidentDate: 'desc' },
    })
    return NextResponse.json(accidents || [])
  } catch (error) {
    console.error('API Kaza GET Error:', error)
    return NextResponse.json({ error: 'DB bağlantı hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.firmId || !body.injuredName || !body.description) {
      return NextResponse.json(
        { error: 'Firma, kazalı adı ve açıklama zorunludur' },
        { status: 400 }
      )
    }

    const accident = await prisma.workAccident.create({
      data: {
        firmId: body.firmId,
        expertId: body.expertId,
        accidentDate: new Date(body.accidentDate),
        accidentTime: body.accidentTime || '',
        location: body.location || '',
        injuredName: body.injuredName,
        injuredTcNo: body.injuredTcNo,
        accidentType: body.accidentType || 'OTHER',
        description: body.description,
        bodyPart: body.bodyPart,
        severity: body.severity || 'FIRST_AID',
        lostDaysEstimate: parseInt(body.lostDaysEstimate) || 0,
        sgkDeadline: new Date(body.sgkDeadline || Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    })
    return NextResponse.json(accident, { status: 201 })
  } catch (error) {
    console.error('API Kaza POST Error:', error)
    return NextResponse.json({ error: 'İstek işlenirken hata oluştu' }, { status: 500 })
  }
}
