import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const d = await prisma.occupationalDisease.update({ where: { id: params.id }, data: { employeeName: body.employeeName, diagnosis: body.diagnosis, icd10Code: body.icd10Code || null, diagnosisDate: new Date(body.diagnosisDate), diagnosisInstitution: body.diagnosisInstitution || null, causativeAgent: body.causativeAgent || null, exposureDuration: body.exposureDuration || null, status: body.status || 'OPEN', jobModification: body.jobModification || null } })
    return NextResponse.json(d)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await prisma.occupationalDisease.delete({ where: { id: params.id } }); return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
