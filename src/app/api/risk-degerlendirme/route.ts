import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const assessments = await prisma.riskAssessment.findMany({
      select: { id: true, firmId: true, version: true, method: true, status: true, validUntil: true, createdAt: true, expertId: true, firm: { select: { id: true, name: true } }, expert: { select: { name: true } }, _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(assessments)
  } catch (error) {
    console.error('API GET RiskAssessments Error:', error)
    return NextResponse.json({ error: 'DB bağlantı hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.method || !body.validUntil || !body.expertId) {
      return NextResponse.json({ error: 'Firma, yöntem, geçerlilik tarihi ve uzman zorunludur' }, { status: 400 })
    }
    const ra = await prisma.riskAssessment.create({
      data: { firmId: body.firmId, expertId: body.expertId, method: body.method, validUntil: new Date(body.validUntil) },
      select: { id: true }
    })
    return NextResponse.json(ra, { status: 201 })
  } catch (error) {
    console.error('API POST RiskAssessment Error:', error)
    return NextResponse.json({ error: 'Risk değerlendirme oluşturma hatası' }, { status: 500 })
  }
}
