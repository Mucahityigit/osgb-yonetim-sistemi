import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const diseases = await prisma.occupationalDisease.findMany({
      select: { id: true, firmId: true, employeeName: true, employeeTcNo: true, diagnosis: true, icd10Code: true, diagnosisDate: true, diagnosisInstitution: true, causativeAgent: true, exposureDuration: true, sgkNotificationDate: true, sgkRefNumber: true, sgkDeadline: true, status: true, jobModification: true, createdAt: true, firm: { select: { id: true, name: true } } },
      orderBy: { diagnosisDate: 'desc' },
    })
    return NextResponse.json(diseases)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.employeeName || !body.diagnosis || !body.diagnosisDate) {
      return NextResponse.json({ error: 'Firma, çalışan, tanı ve tarih zorunludur' }, { status: 400 })
    }
    const disease = await prisma.occupationalDisease.create({
      data: { firmId: body.firmId, employeeName: body.employeeName, employeeTcNo: body.employeeTcNo || null, diagnosis: body.diagnosis, icd10Code: body.icd10Code || null, diagnosisDate: new Date(body.diagnosisDate), diagnosisInstitution: body.diagnosisInstitution || null, causativeAgent: body.causativeAgent || null, exposureDuration: body.exposureDuration || null, jobModification: body.jobModification || null, sgkDeadline: new Date(body.sgkDeadline || Date.now() + 3 * 24 * 60 * 60 * 1000) },
      select: { id: true }
    })
    return NextResponse.json(disease, { status: 201 })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 }) }
}
