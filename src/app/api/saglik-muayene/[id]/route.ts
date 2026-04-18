import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const exam = await prisma.healthExamination.update({ where: { id: params.id }, data: { examDate: new Date(body.examDate), examType: body.examType, result: body.result, conditions: body.conditions || null, nextExamDate: body.nextExamDate ? new Date(body.nextExamDate) : null } })
    return NextResponse.json(exam)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await prisma.healthExamination.delete({ where: { id: params.id } }); return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
