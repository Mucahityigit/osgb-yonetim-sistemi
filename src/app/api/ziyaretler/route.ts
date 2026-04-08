import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const visits = await prisma.siteVisit.findMany({
      include: { firm: true, expert: true },
      orderBy: { visitDate: 'desc' },
    })
    return NextResponse.json(visits || [])
  } catch (error) {
    console.error('API Ziyaret GET Error:', error)
    return NextResponse.json({ error: 'DB bağlantı hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.visitDate || !body.description) {
      return NextResponse.json({ error: 'Firma, tarih ve açıklama zorunludur' }, { status: 400 })
    }

    const visit = await prisma.siteVisit.create({
      data: {
        firmId: body.firmId,
        expertId: body.expertId,
        visitDate: new Date(body.visitDate),
        startTime: new Date(`${body.visitDate}T${body.startTime || '09:00'}`),
        endTime: new Date(`${body.visitDate}T${body.endTime || '17:00'}`),
        durationMinutes: parseInt(body.durationMinutes) || 0,
        visitType: body.visitType || 'PERIODIC_CONTROL',
        description: body.description,
        findings: body.findings,
        actions: body.actions,
      },
    })
    return NextResponse.json(visit, { status: 201 })
  } catch (error) {
    console.error('API Ziyaret POST Error:', error)
    return NextResponse.json({ error: 'İstek işlenirken hata oluştu' }, { status: 500 })
  }
}
